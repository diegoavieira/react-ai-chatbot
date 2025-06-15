import { GoogleGenAI } from '@google/genai';

const googleGenAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOGGLE_GEN_AI_API_KEY });

export class GoogleGenAIService {
  #chat;

  constructor(model = 'gemini-1.5-flash') {
    this.#chat = googleGenAI.chats.create({ model, history: [] });
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage({ message: content });
      return result.text;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async *chatStream(content) {
    try {
      const result = await this.#chat.sendMessageStream({ message: content });

      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
