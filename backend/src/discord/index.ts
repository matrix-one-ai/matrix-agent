import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {
  discordChannelReplyPrompt,
  discordJudgeIfShouldReply,
} from "./prompts";
import sami from "../characters/sami";
import { generateTextFromPrompt } from "../ai";

dotenv.config();

export const discordAgentInit = () => {
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
      const messages = await message.channel.messages.fetch({ limit: 25 });
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
      } else {
        console.log("Should not reply");
        return;
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};
