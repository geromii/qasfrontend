/* eslint-disable import/no-mutable-exports */
/* eslint-disable simple-import-sort/imports */
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Client } from 'pg';
import * as schema from '@/models/Schema';
import { Env } from './Env';
import path from 'path';

console.log('NEXT_PHASE:', process.env.NEXT_PHASE);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', Env.DATABASE_URL ? 'Set' : 'Not set');

const migrationsFolder = path.join(process.cwd(), 'migrations');

let db: PgDatabase<any, any, any> | null = null;

async function initializeDatabase() {
  if (db) return db;

  try {
    if (
      process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD &&
      process.env.NODE_ENV === 'production' &&
      Env.DATABASE_URL
    ) {
      console.log('Initializing production database');
      const client = new Client({
        connectionString: Env.DATABASE_URL,
      });
      await client.connect();
      db = drizzlePg(client, { schema });
      await migratePg(db, { migrationsFolder });
    } else {
      console.log('Initializing development database (PGlite)');
      const global = globalThis as unknown as { client: PGlite };
      if (!global.client) {
        global.client = new PGlite();
        await global.client.waitReady;
      }
      db = drizzlePglite(global.client, { schema });
      await migratePglite(db, { migrationsFolder });
    }
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    db = await initializeDatabase();
  }
  return db;
}
