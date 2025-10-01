import { streamObject } from "ai";
import { tasksSchema } from "@/app/api/schemas";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Delegate to AI SDK server utilities (expects provider configured via env)
  const result = streamObject({
    model: "openai/gpt-4o",
    schema: tasksSchema,
    prompt: `You are an AI assistant that generates realistic development task workflows. Generate a set of tasks that would occur during ${prompt}.

Each task should have:
- A descriptive title
- Multiple task items showing the progression
- Some items should be plain text, others should reference files
- Use realistic file names and appropriate file types
- Status should progress from pending to in_progress to completed

For file items, use these icon types: 'react', 'typescript', 'javascript', 'css', 'html', 'json', 'markdown'

Generate 3-4 tasks total, with 4-6 items each.`,
  });

  return result.toTextStreamResponse();
}

