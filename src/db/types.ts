import {PlantIssue} from '@/ai/types';

export type Plant = {
  id: string;
  name: string;
  species: string | null;
  commonName: string | null;
  photoUri: string | null;
  createdAt: number;
  wateringIntervalDays: number | null;
  lightRequirement: string | null;
  humidityRequirement: string | null;
  notes: string | null;
};

export type NewPlant = {name: string} & Partial<
  Omit<Plant, 'id' | 'createdAt' | 'name'>
>;

export type PlantCheck = {
  id: string;
  plantId: string;
  checkedAt: number;
  photoUri: string | null;
  species: string | null;
  commonName: string | null;
  wateringIntervalDays: number | null;
  lightRequirement: string | null;
  humidityRequirement: string | null;
  healthStatus: 'healthy' | 'warning' | 'critical' | null;
  issues: PlantIssue[] | null;
};

export type NewPlantCheck = Omit<PlantCheck, 'id' | 'checkedAt'>;
