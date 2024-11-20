import { createAzure } from "@ai-sdk/azure";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE!,
  apiKey: process.env.AZURE_OPENAI_KEY!,
});

export async function generateTextFromPrompt(prompt: string) {
  try {
    const result = await generateText({
      model: azure("gpt-4o-mini"),
      prompt,
      frequencyPenalty: 1,
      presencePenalty: 1,
      temperature: 0.4,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
