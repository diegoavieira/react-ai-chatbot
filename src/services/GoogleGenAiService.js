import { GoogleGenAI } from '@google/genai';

const googleGenAi = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOGGLE_AI_API_KEY });

export default class GoogleGenAIService {
  #chat;

  constructor(model = 'gemini-1.5-flash') {
    this.#chat = googleGenAi.chats.create({ model, history: [] });
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage({ message: content });
      return result.text;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
