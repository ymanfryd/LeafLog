import {db} from '@/db/client';
import {plants, type Plant, type NewPlant} from '@/db/schema';
import {desc, eq} from 'drizzle-orm';
import {v4 as uuidv4} from 'uuid';

export async function getPlants(): Promise<Plant[]> {
  return db.select().from(plants).orderBy(desc(plants.createdAt));
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const rows = await db.select().from(plants).where(eq(plants.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPlant(
  input: Omit<NewPlant, 'id' | 'createdAt'>,
): Promise<Plant> {
  const plant: NewPlant = {
    id: uuidv4(),
    createdAt: new Date(),
    ...input,
  };
  const [row] = await db.insert(plants).values(plant).returning();
  if (!row) {
    throw new Error('Failed to insert plant');
  }
  return row;
}

export async function deletePlant(id: string): Promise<void> {
  await db.delete(plants).where(eq(plants.id, id));
}
