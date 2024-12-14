import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  TelegramAction,
  telegramCryptoAnalysis,
  telegramJudgementPrompt,
  telegramReplyPrompt,
} from "./prompt";
import sami from "../characters/sami";
import { generateTextFromPrompt } from "../ai";
import { pushActivityLog } from "../logs";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);

const previousMessages: any[] = [];

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

export const telegramAgentInit = () => {
  cacheCoinGeckoTokenList();

  setInterval(() => {
    cacheCoinGeckoTokenList();
  }, 1000 * 60 * 60 * 12); // 24 hours

  bot.launch();

  bot.on(message("text"), async (ctx) => {
    try {
      if (!ctx.message.text.includes("@SamitheQueen_bot")) {
        return;
      }

      const judgement = await generateTextFromPrompt(
        telegramJudgementPrompt(ctx.message.text),
        "gpt-4o",
        {
          temperature: 0.3,
          frequencyPenalty: 0.3,
          presencePenalty: 0.3,
        }
      );

      if (!judgement?.text) {
        console.log("No judgement generated.");
        return;
      }

      const judgementJson = JSON.parse(judgement.text);

      console.log(judgementJson);

      if (judgementJson.type === TelegramAction.contractAnalysis) {
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

          if (!tokenId) {
            ctx.telegram.sendMessage(
              ctx.message.chat.id,
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
            ctx.telegram.sendMessage(
              ctx.message.chat.id,
              "I'm sorry, I don't have realtime data on that coin."
            );
            console.log(await tokenInfoResp.text());
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
          telegramCryptoAnalysis(
            sami,
            tokenInfo,
            ctx.message.text,
            ctx.message.from.username!
          ),
          "gpt-4o-mini",
          {
            temperature: 0.2,
            frequencyPenalty: 0.2,
            presencePenalty: 0.2,
          }
        );

        if (tokenAnalysis?.text) {
          previousMessages.push(ctx.message.text);

          await ctx.telegram.sendMessage(
            ctx.message.chat.id,
            tokenAnalysis.text
          );

          return pushActivityLog({
            moduleType: "telegram",
            title: "Crypto analysis",
            description: tokenAnalysis.text,
          });
        } else {
          ctx.telegram.sendMessage(
            ctx.message.chat.id,
            "I'm sorry, I don't have realtime data on that coin."
          );
        }
      }

      if (judgementJson.type === TelegramAction.simpleReply) {
        console.log("Simple reply requested.");

        const reply = await generateTextFromPrompt(
          telegramReplyPrompt(
            sami,
            ctx.message.text,
            ctx.message.from.username!,
            previousMessages.join("\n")
          ),
          "gpt-4o-mini",
          {
            temperature: 0.3,
            frequencyPenalty: 0.7,
            presencePenalty: 0.7,
          }
        );

        if (!reply?.text) {
          console.log("No reply generated.");
          return;
        }

        previousMessages.push(ctx.message.text);

        return await ctx.telegram.sendMessage(ctx.message.chat.id, reply.text);
      }
    } catch (e) {
      console.log(e);
    }
  });
};
