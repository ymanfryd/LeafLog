import {db} from '@/db/client';
import {v4 as uuidv4} from 'uuid';
import type {Plant, NewPlant} from '@/db/types';

function rowToPlant(row: any): Plant {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    commonName: row.common_name,
    photoUri: row.photo_uri,
    createdAt: row.created_at,
    wateringIntervalDays: row.watering_interval_days,
    lightRequirement: row.light_requirement,
    humidityRequirement: row.humidity_requirement,
    notes: row.notes,
  };
}

export async function getPlants(): Promise<Plant[]> {
  const {rows} = await db.execute(
    'SELECT * FROM plants ORDER BY created_at DESC',
  );
  return (rows ?? []).map(rowToPlant);
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const {rows} = await db.execute('SELECT * FROM plants WHERE id = ? LIMIT 1', [
    id,
  ]);
  const first = rows?.[0];
  return first ? rowToPlant(first) : null;
}

export async function createPlant(input: NewPlant): Promise<Plant> {
  const id = uuidv4();
  const createdAt = Date.now();
  const plant: Plant = {
    id,
    name: input.name,
    species: input.species ?? null,
    commonName: input.commonName ?? null,
    photoUri: input.photoUri ?? null,
    createdAt,
    wateringIntervalDays: input.wateringIntervalDays ?? null,
    lightRequirement: input.lightRequirement ?? null,
    humidityRequirement: input.humidityRequirement ?? null,
    notes: input.notes ?? null,
  };
  await db.execute(
    `INSERT INTO plants (
      id, name, species, common_name, photo_uri, created_at,
      watering_interval_days, light_requirement, humidity_requirement, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      plant.id,
      plant.name,
      plant.species,
      plant.commonName,
      plant.photoUri,
      plant.createdAt,
      plant.wateringIntervalDays,
      plant.lightRequirement,
      plant.humidityRequirement,
      plant.notes,
    ],
  );
  return plant;
}

export async function updatePlant(
  id: string,
  patch: Partial<Omit<Plant, 'id' | 'createdAt'>>,
): Promise<void> {
  const columnMap: Record<string, string> = {
    name: 'name',
    species: 'species',
    commonName: 'common_name',
    photoUri: 'photo_uri',
    wateringIntervalDays: 'watering_interval_days',
    lightRequirement: 'light_requirement',
    humidityRequirement: 'humidity_requirement',
    notes: 'notes',
  };

  const entries = Object.entries(patch).filter(([key]) => key in columnMap);
  if (entries.length === 0) return;

  const setClause = entries.map(([key]) => `${columnMap[key]} = ?`).join(', ');
  const values = entries.map(([, value]) => value ?? null);

  await db.execute(`UPDATE plants SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
}

export async function deletePlant(id: string): Promise<void> {
  await db.execute('DELETE FROM plants WHERE id = ?', [id]);
}
