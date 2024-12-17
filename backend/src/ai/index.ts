import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

const openai = createOpenAI({
  baseURL: process.env.OPENAI_LLAMA_ENDPOINT!,
  apiKey: process.env.OPENAI_LLAMA_API_KEY!,
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
  console.log(model, temperature, frequencyPenalty, presencePenalty);
  try {
    const result = await generateText({
      model: openai("huihui-ai/Llama-3.2-3B-Instruct-abliterated"),
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
