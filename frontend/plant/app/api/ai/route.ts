import { CoreMessage, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export const maxDuration = 30;
export const revalidate = 0;

const openai = createOpenAI({
  baseURL: process.env.OPENAI_LLAMA_ENDPOINT!,
  apiKey: process.env.OPENAI_LLAMA_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const stream = streamText({
      model: openai("huihui-ai/Llama-3.2-3B-Instruct-abliterated"),
      messages,
      frequencyPenalty: 1,
      presencePenalty: 1,
      temperature: 0.75,
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
