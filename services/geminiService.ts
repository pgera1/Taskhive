
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "../types";

const apiKey = process.env.API_KEY || '';

const getClient = () => new GoogleGenAI({ apiKey });

export const generateProjectPlan = async (goal: string): Promise<{ tasks: any[] }> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = getClient();
  
  const systemInstruction = `
    You are an expert Project Manager. 
    Break down the user's project goal into 5-10 actionable, concrete tasks.
    Assign a realistic priority (LOW, MEDIUM, HIGH) to each task.
    Keep titles concise and descriptions helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a project plan for: "${goal}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { 
                    type: Type.STRING, 
                    enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH] 
                  },
                },
                required: ["title", "description", "priority"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
