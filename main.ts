const ICON = "👮🏻‍♂️ ";
const ICON_ERROR = "🚨 ";
const API_KEY = process.env.ANTHROPIC_API_KEY_FOR_DREBIN;
const MODEL = "claude-opus-4-6";
const MAX_TOKENS = 1024;

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function request(messages: Message[]): Promise<string> {
  if (!API_KEY) {
    throw new Error("No ANTHROPIC_API_KEY_FOR_DREBIN found in the environment");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`API: ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  return data.content[0].text;
}

async function readUserInput(): Promise<string | undefined> {
  for await (const line of console) return line;
}

async function main() {
  const messages: Message[] = [];
  while (true) {
    process.stdout.write(ICON);
    const input = await readUserInput();
    if (input === "/quit") {
      break;
    }
    if (!input?.trim()) {
      continue;
    }
    try {
      messages.push({ role: "user", content: input });
      const reply = await request(messages);
      messages.push({ role: "assistant", content: reply });
      console.log(reply);
    } catch (err) {
      messages.pop(); // we remove the last user message
      console.error(ICON_ERROR, err instanceof Error ? err.message : err);
      continue;
    }
  }
}

await main();
