import {open} from '@op-engineering/op-sqlite';
import {drizzle} from 'drizzle-orm/op-sqlite';
import * as schema from './schema';

const sqlite = open({name: 'leaflog.db'});

sqlite.execute(`
  CREATE TABLE IF NOT EXISTS plants (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    species TEXT,
    common_name TEXT,
    photo_uri TEXT,
    created_at INTEGER NOT NULL,
    watering_interval_days INTEGER,
    light_requirement TEXT,
    humidity_requirement TEXT,
    notes TEXT
  );
`);

export const db = drizzle(sqlite, {schema});
