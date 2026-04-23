console.log("👮🏻‍♂️");

function main() {
  const prompt = Bun.argv[2];
  if (!prompt) {
    console.log("You need to ask a question");
    return;
  }

  console.log("// Thinking ...");
}

main();
