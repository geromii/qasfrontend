import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import path from 'path';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

// Logging environment variables for debugging
console.log('NEXT_PHASE:', process.env.NEXT_PHASE);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', Env.DATABASE_URL ? 'Set' : 'Not set');

let client;
let drizzle: PgDatabase<any, any, any>;

// Using an absolute path for migrations
const migrationsFolder = path.join(process.cwd(), 'migrations');

async function initializeDatabase() {
  try {
    if (
      process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD &&
      process.env.NODE_ENV === 'production' &&
      Env.DATABASE_URL
    ) {
      console.log('Initializing production database');
      client = new Client({
        connectionString: Env.DATABASE_URL,
      });
      await client.connect();
      drizzle = drizzlePg(client, { schema });
      await migratePg(drizzle, { migrationsFolder });
    } else {
      console.log('Initializing development database (PGlite)');
      const global = globalThis as unknown as { client: PGlite };
      if (!global.client) {
        global.client = new PGlite();
        await global.client.waitReady;
      }
      drizzle = drizzlePglite(global.client, { schema });
      await migratePglite(drizzle, { migrationsFolder });
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize the database
initializeDatabase().catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

export const db = drizzle;
