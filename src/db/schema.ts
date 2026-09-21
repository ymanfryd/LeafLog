import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const plants = sqliteTable('plants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  species: text('species'),
  commonName: text('common_name'),
  photoUri: text('photo_uri'),
  createdAt: integer('created_at', {mode: 'timestamp'}).notNull(),
  wateringIntervalDays: integer('watering_interval_days'),
  lightRequirement: text('light_requirement'),
  humidityRequirement: text('humidity_requirement'),
  notes: text('notes'),
});

export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;
