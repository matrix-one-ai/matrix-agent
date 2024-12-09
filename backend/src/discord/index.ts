import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {
  DiscordAction,
  discordChannelReplyPrompt,
  discordCryptoAnalysis,
  discordJudgementPrompt,
} from "./prompts";
import sami from "../characters/sami";
import { generateTextFromPrompt } from "../ai";
import { pushActivityLog } from "../logs";

dotenv.config();

let tokenList: { id: string; symbol: string }[] = [];

const cacheCoinGeckoTokenList = async () => {
  const resp = await fetch("https://api.coingecko.com/api/v3/coins/list", {
    headers: {
      "x-cg-pro-api-key": process.env.COINGECKO_API_KEY!,
    },
  });

  const data = await resp.json();

  data.forEach((token: { id: string; symbol: string }) => {
    tokenList.push({
      id: token.id,
      symbol: token.symbol,
    });
  });

  console.log("Cached CoinGecko token list");
};

const messageCounts: Map<string, number> = new Map();
const MATRIX_ONE_GUILD_ID = "914170422382194719";

setInterval(() => {
  messageCounts.clear();
}, 1000 * 60 * 60 * 24); // 24 hours

export const discordAgentInit = async () => {
  cacheCoinGeckoTokenList();

  setInterval(() => {
    cacheCoinGeckoTokenList();
  }, 1000 * 60 * 60 * 12); // 24 hours

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on("ready", () => {
    console.log(`Logged in as ${client?.user?.tag}!`);
  });

  client.on("messageCreate", async (message) => {
    console.log(message.content);

    if (!message.author.bot) {
      const guildId = message.guild?.id;
      if (guildId && guildId !== MATRIX_ONE_GUILD_ID) {
        const count = messageCounts.get(guildId) || 0;
        if (count >= 100) {
          console.log("Message limit reached");
          message.channel.send(
            "I'm sorry, I can only process 100 messages per server per day. Contact Matrix One to unlock fully."
          );
          return;
        }
      }

      if (guildId && guildId !== MATRIX_ONE_GUILD_ID) {
        messageCounts.set(guildId, (messageCounts.get(guildId) || 0) + 1);
      }

      const messages = await message.channel.messages.fetch({ limit: 10 });
      let index = 0;
      const sortedMessages = messages
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map((msg) => {
          index++;
          return `${msg.author.username}: ${msg.content}`;
        });

      console.log(sortedMessages);

      const judgement = await generateTextFromPrompt(
        discordJudgementPrompt(sami, message.content, sortedMessages),
        "gpt-4o-mini",
        {
          temperature: 0.1,
          frequencyPenalty: 0.2,
          presencePenalty: 0.2,
        }
      );

      if (!judgement?.text) {
        console.log("No judgement generated.");
        return;
      }

      const judgementJson = JSON.parse(judgement.text);

      console.log("Judgement", judgementJson);

      if (judgementJson.type === DiscordAction.simpleReply) {
        const prompt = discordChannelReplyPrompt(
          sami,
          message.content,
          message.author.displayName,
          sortedMessages
        );

        const reply = await generateTextFromPrompt(prompt, "gpt-4o-mini", {
          temperature: 0.2,
          frequencyPenalty: 0.2,
          presencePenalty: 0.2,
        });

        if (reply?.text) {
          message.channel.send(reply?.text);

          pushActivityLog({
            moduleType: "discord",
            title: "Reply to message",
            description: reply?.text,
          });
        }
      } else if (judgementJson.type === DiscordAction.contractAnalysis) {
        const tokenTicker = judgementJson.ticker;
        const contractAddress = judgementJson.contract;

        console.log("Contract analysis", tokenTicker, contractAddress);

        let tokenInfo = null;

        if (tokenTicker) {
          const searchTokensResponse = tokenList.find(
            (token) =>
              token.symbol.toLowerCase() === tokenTicker?.toLocaleLowerCase()
          );

          let tokenId = searchTokensResponse?.id;

          if (tokenTicker === "matrix" || tokenTicker === "MATRIX") {
            tokenId = "matrix-one";
          }

          console.log("Search tokens response", tokenId);

          if (!searchTokensResponse) {
            message.channel.send(
              "I'm sorry, I don't have realtime data on that coin."
            );
            return;
          }

          const tokenInfoResp = await fetch(
            `https://api.coingecko.com/api/v3/coins/${tokenId}`,
            {
              headers: {
                "x-cg-pro-api-key": process.env.COINGECKO_API_KEY!,
              },
            }
          );

          if (!tokenInfoResp.ok) {
            message.channel.send(
              "I'm sorry, I don't have realtime data on that coin."
            );
            return;
          }

          tokenInfo = await tokenInfoResp.json();
        } else if (contractAddress) {
          const platforms = [
            "ethereum",
            "polkadot",
            "flow",
            "avalanche",
            "optimistic-ethereum",
            "stellar",
            "near-protocol",
            "hedera-hashgraph",
            "zksync",
            "tron",
            "celo",
            "arbitrum-one",
            "base",
            "polygon-pos",
            "solana",
          ];

          for (const platform of platforms) {
            const resp = await fetch(
              `https://pro-api.coingecko.com/api/v3/coins/${platform}/contract/${judgementJson.contract}`,
              {
                headers: {
                  "x-cg-pro-api-key": process.env.COINGECKO_API_KEY!,
                },
              }
            );

            if (resp.ok) {
              tokenInfo = await resp.json();
              break;
            } else {
              continue;
            }
          }
        }

        const tokenAnalysis = await generateTextFromPrompt(
          discordCryptoAnalysis(
            sami,
            tokenInfo,
            message.content,
            message.author.displayName
          ),
          "gpt-4o-mini",
          {
            temperature: 0.2,
            frequencyPenalty: 0.2,
            presencePenalty: 0.2,
          }
        );

        if (tokenAnalysis?.text) {
          message.channel.send(tokenAnalysis.text);
          pushActivityLog({
            moduleType: "discord",
            title: "Crypto analysis",
            description: tokenAnalysis.text,
          });
        } else {
          message.channel.send(
            "I'm sorry, I don't have realtime data on that coin."
          );
        }
      } else {
        console.log("Should not reply");
        return;
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};
