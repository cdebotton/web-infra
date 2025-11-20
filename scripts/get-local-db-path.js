#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read wrangler config from the directory where this script is called
const wranglerPath = process.argv[2] || 'wrangler.jsonc';
const wranglerConfig = JSON.parse(
	readFileSync(wranglerPath, 'utf-8')
		.replace(/\/\/.*/g, '') // Remove single-line comments
		.replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
);

if (!wranglerConfig.d1_databases?.[0]) {
	console.error('No D1 database found in wrangler.jsonc');
	process.exit(1);
}

const db = wranglerConfig.d1_databases[0];
const databaseId = db.database_id;
const databaseName = db.database_name;

// Wrangler uses a hash of the database binding configuration
// The hash includes: binding name, database name, and database ID
const hashInput = `DB:${databaseName}:${databaseId}`;
const hash = createHash('sha256').update(hashInput).digest('hex');

const dbPath = resolve(
	__dirname,
	'../.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
	`${hash}.sqlite`
);

console.log(dbPath);
