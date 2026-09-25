import {db} from '@/db/client';
import {v4 as uuidv4} from 'uuid';
import {NewPlantCheck, PlantCheck} from '@/db/types';

function rowToPlantCheck(row: any): PlantCheck {
  return {
    id: row.id,
    plantId: row.plant_id,
    checkedAt: row.checked_at,
    photoUri: row.photo_uri,
    species: row.species,
    commonName: row.common_name,
    wateringIntervalDays: row.watering_interval_days,
    lightRequirement: row.light_requirement,
    humidityRequirement: row.humidity_requirement,
    healthStatus: row.health_status,
    issues: row.issues ? JSON.parse(row.issues) : [],
  };
}

export async function getChecksForPlant(
  plantId: string,
): Promise<PlantCheck[]> {
  const {rows} = await db.execute(
    'SELECT * FROM plant_checks WHERE plant_id = ? ORDER BY checked_at DESC',
    [plantId],
  );
  return (rows ?? []).map(rowToPlantCheck);
}

export async function getLatestCheck(
  plantId: string,
): Promise<PlantCheck | null> {
  const {rows} = await db.execute(
    'SELECT * FROM plant_checks WHERE plant_id = ? ORDER BY checked_at DESC LIMIT 1',
    [plantId],
  );
  const first = rows?.[0];
  return first ? rowToPlantCheck(first) : null;
}

export async function createPlantCheck(
  input: NewPlantCheck,
): Promise<PlantCheck> {
  const id = uuidv4();
  const checkedAt = Date.now();
  await db.execute(
    `INSERT INTO plant_checks (
      id, plant_id, checked_at, photo_uri, species, common_name,
      watering_interval_days, light_requirement, humidity_requirement,
      health_status, issues
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.plantId,
      checkedAt,
      input.photoUri,
      input.species,
      input.commonName,
      input.wateringIntervalDays,
      input.lightRequirement,
      input.humidityRequirement,
      input.healthStatus,
      input.issues ? JSON.stringify(input.issues) : null,
    ],
  );
  return {...input, id, checkedAt};
}
