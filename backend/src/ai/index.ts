import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

const openai = createOpenAI({
  baseURL: process.env.ASKAH_URL!,
  apiKey: process.env.AKASH_API_KEY!,
});

export async function generateTextFromPrompt(
  prompt: string,
  model: "gpt-4o-mini" | "gpt-4o" = "gpt-4o-mini",
  {
    temperature = 0.4,
    frequencyPenalty = 0.5,
    presencePenalty = 0.5,
  } = {}
) {
  try {
    const result = await generateText({
      model: openai("Meta-Llama-3-3-70B-Instruct"),
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
