import { createAzure } from "@ai-sdk/azure";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE!,
  apiKey: process.env.AZURE_OPENAI_KEY!,
});

export async function generateTextFromPrompt(
  prompt: string,
  { temperature = 0.4, frequencyPenalty = 0.5, presencePenalty = 0.5 }
) {
  try {
    const result = await generateText({
      model: azure("gpt-4o-mini"),
      prompt,
      frequencyPenalty,
      presencePenalty,
      temperature,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
