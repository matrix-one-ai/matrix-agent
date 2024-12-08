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

const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);

const previousMessages: any[] = [];

export const telegramAgentInit = () => {
  bot.launch();

  bot.on(message("text"), async (ctx) => {
    try {
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
        console.log("Contract analysis requested.");

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

        let tokenInfoResp = null;

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
            tokenInfoResp = resp;
            break;
          } else {
            continue;
          }
        }

        if (!tokenInfoResp) {
          return await ctx.telegram.sendMessage(
            ctx.message.chat.id,
            "I'm sorry, I don't have realtime data on that contract."
          );
        }

        const tokenInfo = await tokenInfoResp.json();

        const reply = await generateTextFromPrompt(
          telegramCryptoAnalysis(
            sami,
            tokenInfo,
            ctx.message.text,
            ctx.message.from.username!
          ),
          "gpt-4o-mini",
          {
            temperature: 0.3,
            frequencyPenalty: 0.3,
            presencePenalty: 0.3,
          }
        );

        if (!reply?.text) {
          console.log("No reply generated.");
          return;
        }

        previousMessages.push(ctx.message.text);

        return await ctx.telegram.sendMessage(ctx.message.chat.id, reply.text);
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
            temperature: 0.5,
            frequencyPenalty: 0.5,
            presencePenalty: 0.5,
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
