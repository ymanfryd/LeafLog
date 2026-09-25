import {ai, GEMINI_MODEL} from './client';
import {retry} from './retry';

const SYSTEM_PROMPT = `You are a knowledgeable houseplant care assistant. Answer questions clearly and practically. Focus on actionable advice. Keep answers under 3 short paragraphs unless the question requires depth.`;

export async function askQuestion(
  question: string,
  options: {onRetry?: (attempt: number) => void} = {},
): Promise<string> {
  return retry(
    async () => {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{role: 'user', parts: [{text: question}]}],
        config: {systemInstruction: SYSTEM_PROMPT},
      });
      if (!response.text) throw new Error('Empty response from Gemini');
      return response.text;
    },
    {onRetry: options.onRetry},
  );
}
