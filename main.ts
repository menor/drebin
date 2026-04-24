const ICON = "👮🏻‍♂️ //";
const API_KEY = process.env.ANTHROPIC_API_KEY_FOR_DREBIN;
const MODEL = "claude-opus-4-6";
const MAX_TOKENS = 1024;

async function request(prompt: string): Promise<undefined | string> {
  if (!API_KEY) {
    console.error(
      ICON,
      "No ANTHROPIC_API_KEY_FOR_DREBIN found in the environment",
    );
    return;
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
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error(response.status, message);
    return;
  }

  const data = await response.json();

  return data.content[0].text;
}

async function main() {
  const prompt = Bun.argv[2];
  if (!prompt) {
    console.log(ICON, "You need to ask a question");
    return;
  }

  console.log(ICON, "Thinking ...");
  const answer = await request(prompt);
  console.log(answer);

  return;
}

await main();
