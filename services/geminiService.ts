
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

// This function lazily initializes the GoogleGenAI client.
// It prevents a crash on startup in browser environments where process.env is not defined.
function getAiClient(): GoogleGenAI {
  if (!ai) {
    // The AI Studio environment provides process.env.API_KEY. If it's not available,
    // it indicates a configuration issue, and we cannot proceed with AI features.
    if (typeof process === 'undefined' || !process.env?.API_KEY) {
      throw new Error("Gemini API key is not configured in the environment.");
    }
    
    // Per project guidelines, the API key is obtained from the environment.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export async function validateMathExpression(promptTemplate: string, studentExpression: string): Promise<string> {
  try {
    const client = getAiClient();
    const prompt = promptTemplate.replace('{STUDENT_EXPRESSION}', studentExpression);
    
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error validating math expression:", error);
    if (error instanceof Error && error.message.includes("API key is not configured")) {
        return "The application is not configured correctly to use the AI service.";
    }
    return "Sorry, I couldn't validate your expression right now. Please try again.";
  }
}


export async function validateEcoImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
  try {
    const client = getAiClient();
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType
      }
    };
    const textPart = {
      text: prompt
    };

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error validating image:", error);
    if (error instanceof Error && error.message.includes("API key is not configured")) {
        return "The application is not configured correctly to use the AI service.";
    }
    return "Sorry, I couldn't analyze the image. Please try again.";
  }
}
