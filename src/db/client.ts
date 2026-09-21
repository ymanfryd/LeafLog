import {open} from '@op-engineering/op-sqlite';
import {drizzle} from 'drizzle-orm/op-sqlite';
import * as schema from './schema';

const sqlite = open({name: 'leaflog.db'});
export const db = drizzle(sqlite, {schema});
