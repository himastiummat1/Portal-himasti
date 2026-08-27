const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.API_KEY_GROQ });
async function test() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{role: "user", content: "Test"}],
      model: "qwen/qwen3.8-27b",
      temperature: 0.5,
      max_tokens: 50,
    });
    console.log(chatCompletion.choices[0]?.message?.content);
  } catch(e) {
    console.error("ERROR:", e);
  }
}
test();
