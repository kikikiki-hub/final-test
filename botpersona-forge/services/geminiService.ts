import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePersonaData = async (
  name: string,
  vibe: string,
  purpose: string
): Promise<GeneratedPersona> => {
  const prompt = `Create a comprehensive persona for a Telegram Bot.
  
  Name: ${name}
  Vibe/Tone: ${vibe}
  Purpose: ${purpose}
  
  I need 5 things:
  1. A robust 'System Instruction' that I can feed into an LLM to make it act exactly like this character. It should be detailed about tone, constraints, and behavior.
  2. A 'BotFather Description'. This is the text users see *before* they click Start. It explains what the bot does. Max 512 chars.
  3. A 'BotFather About Text'. This appears on the bot's profile page. Short, punchy. Max 120 chars.
  4. A 'Welcome Message'. The first thing the bot sends when someone types /start.
  5. A list of 'Bot Commands' formatted for BotFather. Strictly follow the format "command - description" (lowercase command, hyphen, description). Include /start, /help, and 2-3 creative commands that fit the persona.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          systemInstruction: {
            type: Type.STRING,
            description: "The detailed system prompt for the LLM.",
          },
          botFatherDescription: {
            type: Type.STRING,
            description: "The text for the /setdescription command.",
          },
          botFatherAbout: {
            type: Type.STRING,
            description: "The text for the /setabouttext command.",
          },
          welcomeMessage: {
            type: Type.STRING,
            description: "An engaging starting message from the character.",
          },
          botCommands: {
            type: Type.STRING,
            description: "List of commands in 'command - description' format, separated by newlines.",
          },
        },
        required: [
          "systemInstruction",
          "botFatherDescription",
          "botFatherAbout",
          "welcomeMessage",
          "botCommands",
        ],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as GeneratedPersona;
};

export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  systemInstruction: string
): Promise<string> => {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemInstruction,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "";
};