import {ai, GEMINI_MODEL} from './client';
import {retry} from './retry';
import type {PlantAnalysis} from './types';
import {Type} from '@google/genai';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    species: {type: Type.STRING},
    commonName: {type: Type.STRING},
    care: {
      type: Type.OBJECT,
      properties: {
        watering: {type: Type.STRING},
        light: {type: Type.STRING},
        humidity: {type: Type.STRING},
      },
      required: ['watering', 'light', 'humidity'],
    },
    wateringIntervalDays: {type: Type.NUMBER},
    lightRequirement: {type: Type.STRING, enum: ['low', 'medium', 'high']},
    humidityRequirement: {type: Type.STRING, enum: ['low', 'medium', 'high']},
    healthStatus: {
      type: Type.STRING,
      enum: ['healthy', 'warning', 'critical'],
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: {type: Type.STRING},
          cause: {type: Type.STRING},
          advice: {type: Type.STRING},
        },
        required: ['issue', 'cause', 'advice'],
      },
    },
  },
  required: [
    'species',
    'commonName',
    'care',
    'wateringIntervalDays',
    'lightRequirement',
    'humidityRequirement',
    'healthStatus',
    'issues',
  ],
};

const PROMPT = `Analyze this houseplant photo. Identify the species. Assess health from the visible leaves, stems, and soil (if visible). Return watering, light and humidity requirements. If there are visible issues (yellowing, spots, wilting, pests), list them with cause and advice. Otherwise leave issues empty. Return response in English.`;

export async function analyzePlant(
  imageBase64: string,
  options: {onRetry?: (attempt: number) => void} = {},
): Promise<PlantAnalysis> {
  return retry(
    async () => {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {inlineData: {mimeType: 'image/jpeg', data: imageBase64}},
              {text: PROMPT},
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      if (!response.text) {
        throw new Error('Empty response from Gemini');
      }
      return JSON.parse(response.text) as PlantAnalysis;
    },
    {onRetry: options.onRetry},
  );
}
