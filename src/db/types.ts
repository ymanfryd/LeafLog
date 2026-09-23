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
