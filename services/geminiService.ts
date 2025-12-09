import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const getChatSession = (): Chat => {
  if (!genAI) {
    initializeGemini();
  }
  
  if (!genAI) {
    throw new Error("Failed to initialize Gemini Client");
  }

  if (!chatSession) {
    chatSession = genAI.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const session = getChatSession();
  return session.sendMessageStream({ message });
};

export const resetSession = () => {
  chatSession = null;
};

export const searchNearbyPlaces = async (
  category: string,
  location: string | { lat: number; lng: number }
): Promise<GenerateContentResponse> => {
  if (!genAI) {
    initializeGemini();
  }
  
  if (!genAI) {
    throw new Error("Failed to initialize Gemini Client");
  }

  let prompt = `Find ${category} nearby.`;
  let toolConfig = undefined;

  if (typeof location === 'string') {
    prompt = `Find ${category} near ${location}.`;
  } else {
    // Location is { lat, lng }
    toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  return await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: toolConfig,
    },
  });
};
