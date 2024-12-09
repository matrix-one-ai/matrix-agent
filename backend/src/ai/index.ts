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
  model: "gpt-4o-mini" | "gpt-4o" = "gpt-4o-mini",
  {
    temperature = 0.4,
    frequencyPenalty = 0.5,
    presencePenalty = 0.5,
    topK = 0,
    topP = 0,
  } = {}
) {
  console.log(model, temperature, frequencyPenalty, presencePenalty);
  try {
    const result = await generateText({
      model: azure(model),
      prompt,
      frequencyPenalty,
      presencePenalty,
      temperature,
      topK,
      topP,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
