export type HealthStatus = 'healthy' | 'warning' | 'critical';
export type LightLevel = 'low' | 'medium' | 'high';
export type HumidityLevel = 'low' | 'medium' | 'high';

export type PlantIssue = {
  issue: string;
  cause: string;
  advice: string;
};

export type PlantAnalysis = {
  species: string; // scientific name
  commonName: string; // colloquial name
  care: {
    watering: string;
    light: string;
    humidity: string;
  };
  wateringIntervalDays: number;
  lightRequirement: LightLevel;
  humidityRequirement: HumidityLevel;
  healthStatus: HealthStatus;
  issues: PlantIssue[];
};
