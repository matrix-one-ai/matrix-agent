import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {
  DiscordAction,
  discordChannelReplyPrompt,
  discordCryptoAnalysis,
  discordHelpPrompt,
  discordJudgementPrompt,
  discordWalletAnalysis,
} from "./prompts";
import sami from "../characters/sami";
import { generateTextFromPrompt } from "../ai";
import { pushActivityLog } from "../logs";
import { moralisWalletAnalysis } from "../moralis";
import { detectBlockchain } from "../helpers/crypto";

dotenv.config();

let tokenList: { id: string; symbol: string }[] = [];

const cacheCoinGeckoTokenList = async () => {
  const resp = await fetch("https://pro-api.coingecko.com/api/v3/coins/list", {
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
    if (message.channel.id !== '1314183332875079730') return;

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

      console.log("Judgement", judgement.text);

      const judgementJson = JSON.parse(judgement.text);

      console.log("JudgementJSON", judgementJson);

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
          if (tokenTicker === "sami" || tokenTicker === "SAMI") {
            tokenId = "sami";
          }

          console.log("Search tokens response", tokenId);

          if (!searchTokensResponse) {
            message.channel.send(
              "I'm sorry, I don't have realtime data on that coin."
            );
            return;
          }

          const tokenInfoResp = await fetch(
            `https://pro-api.coingecko.com/api/v3/coins/${tokenId}`,
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
      } else if (judgementJson.type === DiscordAction.walletAnalysis) {
        const wallet = judgementJson.wallet;

        const chain = detectBlockchain(wallet);

        if (chain === "unknown") {
          message.channel.send(
            "I'm sorry, I don't recognize that address chain."
          );
          return;
        }

        const moralisAnalysis = await moralisWalletAnalysis(wallet, chain);

        const walletAnalysis = await generateTextFromPrompt(
          discordWalletAnalysis(
            sami,
            moralisAnalysis,
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

        if (walletAnalysis?.text) {
          message.channel.send(walletAnalysis.text);
          pushActivityLog({
            moduleType: "discord",
            title: "Wallet analysis",
            description: walletAnalysis.text,
          });
        } else {
          message.channel.send(
            "I'm sorry, I don't have realtime data on that wallet."
          );
        }
      } else if (judgementJson.type === DiscordAction.help) {
        const helpResponse = await generateTextFromPrompt(
          discordHelpPrompt(sami, message.content, message.author.displayName),
          "gpt-4o-mini",
          {
            temperature: 0.2,
            frequencyPenalty: 0.2,
            presencePenalty: 0.2,
          }
        );

        if (helpResponse?.text) {
          message.channel.send(helpResponse.text);
          pushActivityLog({
            moduleType: "discord",
            title: "Help response",
            description: helpResponse.text,
          });
        } else {
          message.channel.send("I'm sorry, I didn't understand that request.");
        }
      } else {
        console.log("Should not reply");
        return;
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};
