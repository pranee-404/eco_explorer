
import { GoogleGenAI } from "@google/genai";

// Per project guidelines, the API key is assumed to be available in the environment.
// The GoogleGenAI constructor will handle cases where the key is missing or invalid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function validateMathExpression(promptTemplate: string, studentExpression: string): Promise<string> {
  try {
    const prompt = promptTemplate.replace('{STUDENT_EXPRESSION}', studentExpression);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error validating math expression:", error);
    return "Sorry, I couldn't validate your expression right now. Please try again.";
  }
}


export async function validateEcoImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType
      }
    };
    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error validating image:", error);
    return "Sorry, I couldn't analyze the image. Please try again.";
  }
}
