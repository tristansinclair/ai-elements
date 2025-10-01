// A mock streaming endpoint that returns chunked text forming a JSON object
// matching the tasksSchema, without requiring any external API keys.

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const write = async (s: string, delay = 0) => {
        await writer.write(encoder.encode(s));
        if (delay) await wait(delay);
      };

      const title1 = `Analyze project structure for ${String(prompt || "the app")}`;
      const CHUNK_DELAY = 700; // ms between semantic chunks
      const TITLE_DELAY = 900; // a bit longer after titles

      await write('{"tasks": [');

      // Task 1 header (bigger chunk for title)
      await write('{"title": ' + JSON.stringify(title1) + ', "status": "in_progress", "items": [', TITLE_DELAY);
      // Now emit items one-by-one
      // Re-open items properly after the header placeholder
      // We'll backtrack by closing correctly: emit the header again but with real items
      // Simpler: restart the object cleanly in-place by closing and rewriting items array
      // Since the parser is tolerant to partial JSON, we'll continue with a valid sequence:
      // replace the temporary '}' with actual first item by just continuing the array content

      // First item
      await write('{"type": "text", "text": "Searching \\"app/page.tsx, components structure\\""}', CHUNK_DELAY);
      // Second item
      await write(', {"type": "file", "text": "Read", "file": {"name": "page.tsx", "icon": "react"}}', CHUNK_DELAY);
      // Third item
      await write(', {"type": "text", "text": "Scanning 52 files"}', CHUNK_DELAY);
      // Fourth item
      await write(', {"type": "file", "text": "Reading files", "file": {"name": "layout.tsx", "icon": "react"}}', CHUNK_DELAY);
      // Close task 1
      await write(']}', CHUNK_DELAY);

      // Separator between tasks
      await write(',');

      // Task 2 header
      await write('{"title": "Set up tooling and config", "status": "pending", "items": [', TITLE_DELAY);
      // Items of task 2
      await write('{"type": "file", "text": "Check types", "file": {"name": "tsconfig.json", "icon": "json"}}', CHUNK_DELAY);
      await write(', {"type": "file", "text": "Style rules", "file": {"name": "tailwind.config.ts", "icon": "typescript"}}', CHUNK_DELAY);
      await write(', {"type": "text", "text": "Verify scripts and dev server"}', CHUNK_DELAY);
      // Close task 2
      await write(']}', CHUNK_DELAY);

      // Close root
      await write(']}');
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
