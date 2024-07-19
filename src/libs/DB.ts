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

console.log('NEXT_PHASE:', process.env.NEXT_PHASE);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', Env.DATABASE_URL ? Env.DATABASE_URL : 'Not set');

// eslint-disable-next-line prettier/prettier

let client;
let drizzle: PgDatabase<any, any, any>;

if (
  process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD &&
  process.env.NODE_ENV === 'production' &&
  Env.DATABASE_URL
) {
  client = new Client({
    connectionString: Env.DATABASE_URL,
  });
  await client.connect();

  drizzle = drizzlePg(client, { schema });
  await migratePg(drizzle, { migrationsFolder: './migrations' });
} else {
  const global = globalThis as unknown as { client: PGlite };

  if (!global.client) {
    global.client = new PGlite();
    await global.client.waitReady;
  }

  drizzle = drizzlePglite(global.client, { schema });
  await migratePglite(drizzle, { migrationsFolder: './migrations' });
}

export const db = drizzle;
