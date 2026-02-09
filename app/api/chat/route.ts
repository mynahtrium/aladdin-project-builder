import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_INSTRUCTION = `
You are an expert AI Research Assistant for the Aladdin Platform (Institute for Future Intelligence).
Your goal is to guide students/researchers through the Scientific Method to design simulation experiments for renewable energy and building physics.

You must follow these phases strictly:
1. **Hypothesis**: Ask the user to define a clear hypothesis if they haven't. (e.g., "Can a house be energy-positive?")
2. **Design Criteria**: Ask for architectural details (House style: Colonial/Ranch/etc., Insulation values, Dimensions, Location).
3. **Test Variables**: Ask what they will change to test the hypothesis (e.g., Solar panel orientation, Window size, Season).
4. **Testing Strategy**: Ask how they plan to run the simulation (Daily vs Yearly, Comparative analysis).
5. **Generation**: Once ALL info is gathered, generate a final Prompt for Aladdin.

**RESPONSE FORMAT**:
You must ALWAYS respond in valid JSON format with the following structure:
{
  "message": "Your conversational response here...",
  "generatedPrompt": null | "The full detailed prompt for Aladdin..."
}

- Keep "generatedPrompt" as null until you have gathered ALL necessary information (Hypothesis, Design, Variables, Strategy).
- When you have all info, set "message" to a concluding remark and "generatedPrompt" to the detailed prompt string.
- The "generatedPrompt" should be formatted clearly with sections: **Project Goal**, **Design Specifications**, **Experimental Setup**, **Aladdin Instructions**.
- In the "message", be encouraging, scientific, and concise. Use formatting (bolding) for key terms.
`;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ 
        message: "Error: GEMINI_API_KEY is not set in the environment variables. Please configure it in .env.local." 
      });
    }

    const { messages } = await req.json();

    // Convert messages to Gemini format
    // Filter out system messages if any, and map roles
    const history = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Gemini requires history to start with 'user'
    // The chat interface often starts with an assistant greeting, so we filter it out from the history
    let validHistory = history.slice(0, -1);
    if (validHistory.length > 0 && validHistory[0].role === 'model') {
        validHistory = validHistory.slice(1);
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chat = model.startChat({
      history: validHistory,
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // Fallback if model didn't return valid JSON
      parsedResponse = {
        message: responseText,
        generatedPrompt: null
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ 
      message: "Sorry, I encountered an error communicating with the AI service. Please check your API key and try again." 
    }, { status: 500 });
  }
}
