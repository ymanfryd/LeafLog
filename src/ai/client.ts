import {GoogleGenAI} from '@google/genai';
import {GEMINI_API_KEY} from '@env';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in .env');
}

export const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export const GEMINI_MODEL = 'gemini-3.6-flash';
