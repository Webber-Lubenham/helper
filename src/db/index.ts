import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'educonnect'
});

export const db = drizzle(pool, { schema });