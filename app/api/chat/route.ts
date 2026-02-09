import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type SupportedLanguage = 'en' | 'tr';

const buildSystemInstruction = (language: SupportedLanguage) => `
You are an expert AI Research Assistant for the Aladdin Platform (Institute for Future Intelligence).
Your goal is to guide students/researchers through the Scientific Method to design simulation experiments for renewable energy and building physics.

Language:
- Respond in ${language === 'tr' ? 'Türkçe' : 'English'}.

Markdown formatting:
- Use GitHub-Flavored Markdown (GFM).
- Use headings, lists, and tables when helpful.

You must follow these phases strictly:
1. **Hypothesis**: Ask the user to define a clear hypothesis if they haven't. (e.g., "Can a house be energy-positive?")
2. **Design Criteria**: Ask for architectural details (House style: Colonial/Ranch/etc., Insulation values, Dimensions, Location).
3. **Test Variables**: Ask what they will change to test the hypothesis (e.g., Solar panel orientation, Window size, Season).
4. **Testing Strategy**: Ask how they plan to run the simulation (Daily vs Yearly, Comparative analysis).
5. **Generation**: Once ALL info is gathered, call the "generatePrompt" tool with the final detailed prompt.

- Do NOT output the generated prompt in the chat text. Only use the tool.
- The generated prompt should be formatted clearly with sections: **Project Goal**, **Design Specifications**, **Experimental Setup**, **Aladdin Instructions**.
- In the chat, be encouraging, scientific, and concise.
`;

export async function POST(req: Request) {
  try {
    const { messages, language, model: requestedModel, apiKey: requestApiKey } = await req.json();
    const preferredLanguage: SupportedLanguage = language === 'tr' ? 'tr' : 'en';
    
    const apiKey = (typeof requestApiKey === 'string' && requestApiKey.trim() ? requestApiKey.trim() : null) ?? process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response("Missing API Key", { status: 400 });
    }

    const googleProvider = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const modelName = typeof requestedModel === 'string' && requestedModel.trim()
      ? requestedModel.trim()
      : 'gemini-3-pro-preview';

    const result = await streamText({
      model: googleProvider(modelName),
      messages,
      system: buildSystemInstruction(preferredLanguage),
      tools: {
        generatePrompt: tool({
          description: 'Generate the final Aladdin project prompt when all phases are complete',
          parameters: z.object({ 
            prompt: z.string().describe('The detailed scientific prompt for Aladdin') 
          }),
          execute: async ({ prompt }: { prompt: string }) => {
            // Return the prompt so it's included in the tool result
            return prompt;
          },
        } as any),
      },
    });

    // Return the response directly
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
