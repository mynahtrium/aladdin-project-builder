const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY not found in .env.local");
    return;
  }

  console.log("Found API Key:", apiKey.substring(0, 5) + "...");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent("Say 'Hello from Gemini!' if you can read this.");
    const response = await result.response;
    const text = response.text();
    console.log("✅ Success! Gemini Response:", text);
  } catch (error) {
    console.error("❌ Error connecting to Gemini:", error.message);
  }
}

testGemini();
