import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import fs from 'fs';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import path from 'path';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

let client;
let drizzle: PgDatabase<any, any, any>;

// eslint-disable-next-line no-console
console.log(Env.DATABASE_URL);

if (
  process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD &&
  process.env.NODE_ENV === 'production' &&
  Env.DATABASE_URL
) {
  // eslint-disable-next-line no-console
  console.log('Connecting to Postgres');
  client = new Client({
    connectionString: Env.DATABASE_URL,
  });
  await client.connect();
  // eslint-disable-next-line no-console
  console.log('Connected to Postgres');

  drizzle = drizzlePg(client, { schema });
  // eslint-disable-next-line no-console
  console.log('Migrating Postgres');
  // eslint-disable-next-line no-console
  console.log('Current working directory:', process.cwd());
  // eslint-disable-next-line no-console
  console.log('Migrations folder:', path.join(process.cwd(), 'migrations'));
  const migrationsFolder = path.join(process.cwd(), 'migrations');
  // eslint-disable-next-line no-console
  console.log('Migrations folder contents:', fs.readdirSync(migrationsFolder));
  await migratePg(drizzle, { migrationsFolder: './migrations' });
  // eslint-disable-next-line no-console
  console.log('Migrated Postgres');
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
