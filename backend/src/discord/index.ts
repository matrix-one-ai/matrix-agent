import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {
  discordChannelReplyPrompt,
  discordCryptoAnalysis,
  discordJudgeIfShouldReply,
  discordJudgeIsCryptoTalk,
} from "./prompts";
import sami from "../characters/sami";
import { generateTextFromPrompt } from "../ai";

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

  console.log("Cached CoinGecko token list", tokenList);
};

export const discordAgentInit = () => {
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

    // List server channels
    client.guilds.cache.forEach((guild) => {
      console.log(`Guild: ${guild.name}`);
      guild.channels.cache.forEach((channel) => {
        console.log(` - ${channel.name} (${channel.type})`);
      });
    });
  });

  client.on("messageCreate", async (message) => {
    console.log(message.content);

    if (!message.author.bot) {
      const messages = await message.channel.messages.fetch({ limit: 100 });
      const sortedMessages = messages
        .filter((msg) => !msg.author.bot)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map((msg) => `${msg.author.username}: ${msg.content}`)
        .join("\n");

      const judgeIfShouldReplyPrompt = discordJudgeIfShouldReply(
        sami,
        message.content,
        sortedMessages
      );

      const shouldReply = await generateTextFromPrompt(
        judgeIfShouldReplyPrompt,
        "gpt-4o",
        {
          temperature: 0.1,
          frequencyPenalty: 0.2,
          presencePenalty: 0.2,
        }
      );

      if (shouldReply?.text === "TRUE") {
        console.log("Should reply");

        const judgeIsCryptoTalk = await generateTextFromPrompt(
          discordJudgeIsCryptoTalk(message.content),
          "gpt-4o",
          {
            temperature: 0.2,
            frequencyPenalty: 0.2,
            presencePenalty: 0.2,
          }
        );

        if (judgeIsCryptoTalk?.text !== "FALSE") {
          const tokenTicker = judgeIsCryptoTalk?.text;
          console.log("Token ticker", tokenTicker);

          const searchTokensResponse = tokenList.find(
            (token) =>
              token.symbol.toLowerCase() === tokenTicker?.toLocaleLowerCase()
          );

          console.log("Search tokens response", searchTokensResponse);

          if (!searchTokensResponse) {
            message.channel.send(
              "I'm sorry, I don't have realtime data on that coin."
            );
            return;
          }

          const tokenInfoResp = await fetch(
            `https://api.coingecko.com/api/v3/coins/${searchTokensResponse.id}`,
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

          const tokenInfo = await tokenInfoResp.json();

          const tokenAnalysis = await generateTextFromPrompt(
            discordCryptoAnalysis(
              sami,
              tokenInfo,
              message.content,
              message.author.displayName
            ),
            "gpt-4o",
            {
              temperature: 0.5,
              frequencyPenalty: 0.5,
              presencePenalty: 0.5,
            }
          );

          if (tokenAnalysis?.text) {
            message.channel.send(tokenAnalysis.text);
          } else {
            message.channel.send(
              "I'm sorry, I don't have realtime data on that coin."
            );
          }
        } else {
          // not a crypto talk
          const prompt = discordChannelReplyPrompt(
            sami,
            message.content,
            message.author.displayName,
            sortedMessages
          );

          const reply = await generateTextFromPrompt(prompt, "gpt-4o", {
            temperature: 0.5,
            frequencyPenalty: 0.5,
            presencePenalty: 0.5,
          });

          if (reply?.text) {
            message.channel.send(reply?.text);
          }
        }
      } else {
        console.log("Should not reply");
        return;
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};
