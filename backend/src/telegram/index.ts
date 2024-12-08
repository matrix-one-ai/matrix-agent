import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { telegramReplyPrompt } from "./prompt";
import sami from "../characters/sami";
import { generateTextFromPrompt } from "../ai";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);

const previousMessages: any[] = [];

export const telegramAgentInit = () => {
  bot.launch();

  bot.on(message("text"), async (ctx) => {
    const prompt = telegramReplyPrompt(
      sami,
      ctx.message.text,
      ctx.message.from.username!,
      previousMessages.join("\n")
    );

    const reply = await generateTextFromPrompt(prompt, "gpt-4o-mini", {
      temperature: 0.5,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
    });

    if (!reply?.text) {
      console.log("No reply generated.");
      return;
    }

    previousMessages.push(ctx.message.text);

    await ctx.telegram.sendMessage(ctx.message.chat.id, reply.text);
  });
};
