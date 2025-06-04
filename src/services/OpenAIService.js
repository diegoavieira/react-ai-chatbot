import OpenAI from 'openai';

const openAi = new OpenAI({ apiKey: import.meta.env.VITE_OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });

export default class OpenAIService {
  #model;

  constructor(model = 'gpt-4o-mini') {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const result = await openAi.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: 'user' }]
      });
      return result.choices[0].message.content;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
