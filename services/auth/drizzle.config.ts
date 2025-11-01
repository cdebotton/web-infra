import { defineConfig } from 'drizzle-kit';
import * as v from 'valibot';

export default defineConfig(
	process.env.LOCAL_DB_PATH
		? {
				schema: './src/db/schema.ts',
				dialect: 'sqlite',
				dbCredentials: {
					url: process.env.LOCAL_DB_PATH,
				},
				verbose: true,
				strict: true,
			}
		: {
				schema: './src/db/schema.ts',
				dialect: 'sqlite',
				driver: 'd1-http',
				dbCredentials: {
					accountId: v.parse(v.string(), process.env.DATABASE_ACCOUNT_ID),
					databaseId: v.parse(v.string(), process.env.DATABASE_ID),
					token: v.parse(v.string(), process.env.DATABASE_TOKEN),
				},
				verbose: true,
				strict: true,
			},
);
