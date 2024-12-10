import { CoreMessage, streamText } from "ai";
import { createAzure } from "@ai-sdk/azure";
import { NextResponse } from "next/server";

export const maxDuration = 30;
export const revalidate = 0;

const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE!,
  apiKey: process.env.AZURE_OPENAI_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const stream = streamText({
      model: azure("gpt-4o-mini"),
      messages,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      temperature: 0.2,
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
