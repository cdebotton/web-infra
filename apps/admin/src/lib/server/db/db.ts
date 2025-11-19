import { drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

import { getRequestEvent } from '$app/server';

export function getDBFromEnv() {
	const { platform } = getRequestEvent();
	if (!platform?.env.DB) {
		throw new Error(`Platform unavailable`);
	}
	return drizzle(platform.env.DB, { schema });
}

export type DatabasePool = ReturnType<typeof getDBFromEnv>;
