
import { GoogleGenAI } from "@google/genai";

// Initialize AI client using named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMobilityAssistantResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are the DashDrive Mobility Concierge. 
        Your goal is to help users plan trips, estimate travel times, and explain how our peer-to-peer fare negotiation works.
        Explain that in DashDrive, passengers offer their price and drivers accept or counter.
        Be helpful, professional, and safety-oriented. 
        Suggest the best vehicle type (Ride, Comfort, Moto) based on their query.`,
      }
    });
    // Access response text property directly
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm currently recalibrating our route systems. How can I help you reach your destination?";
  }
};
