// helpers/fetchWithProgress.ts

export async function fetchWithProgress(
  url: string,
  onProgress: (progress: number) => void
): Promise<ArrayBuffer> {
  const response = await fetch(url);
  const contentLength = response.headers.get("content-length");

  if (!contentLength) {
    throw new Error("Content-Length response header missing");
  }

  const total = parseInt(contentLength, 10);
  let loaded = 0;
  let lastProgress = 0;

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("ReadableStream not supported in this browser.");
  }

  const chunks: Uint8Array[] = [];
  const progressThreshold = 1; // Set to 1% threshold

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.length;
      const progress = (loaded / total) * 100;

      if (progress - lastProgress > progressThreshold) {
        onProgress(progress);
        lastProgress = progress;
      }
    }
  }

  // Concatenate all chunks into a single ArrayBuffer
  const arrayBuffer = concatenateChunks(chunks, total);
  return arrayBuffer;
}

function concatenateChunks(chunks: Uint8Array[], total: number): ArrayBuffer {
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result.buffer;
}
