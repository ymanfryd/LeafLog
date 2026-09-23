import {open} from '@op-engineering/op-sqlite';

export const db = open({name: 'leaflog.db'});

db.execute(`
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
