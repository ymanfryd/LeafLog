import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import {db} from './client';
import migrations from './migrations/index';

export function useAppMigrations() {
  return useMigrations(db, migrations);
}
