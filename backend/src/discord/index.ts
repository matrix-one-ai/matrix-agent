import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { discordChannelReplyPrompt } from "./prompts";
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

    if (!message.author.bot && message.mentions.has(client.user!)) {
      const messages = await message.channel.messages.fetch({ limit: 25 });
      const sortedMessages = messages
        .filter((msg) => !msg.author.bot)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map((msg) => `${msg.author.username}: ${msg.content}`)
        .join("\n");

      const prompt = discordChannelReplyPrompt(
        sami,
        message.content,
        message.author.displayName,
        sortedMessages
      );

      const reply = await generateTextFromPrompt(prompt, "gpt-4o", {
        temperature: 0.8,
        frequencyPenalty: 1,
        presencePenalty: 1,
      });

      if (reply?.text) {
        message.channel.send(reply?.text);
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};
