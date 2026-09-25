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

db.execute(`
  CREATE TABLE IF NOT EXISTS plant_checks (
    id TEXT PRIMARY KEY NOT NULL,
    plant_id TEXT NOT NULL,
    checked_at INTEGER NOT NULL,
    photo_uri TEXT,
    species TEXT,
    common_name TEXT,
    watering_interval_days INTEGER,
    light_requirement TEXT,
    humidity_requirement TEXT,
    health_status TEXT,
    issues TEXT,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
  );
`);

db.execute('PRAGMA foreign_keys = ON;');
