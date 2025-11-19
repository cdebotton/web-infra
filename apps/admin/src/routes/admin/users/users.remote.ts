import { redirect } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

import { getDBFromEnv } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema';

import { getRequestEvent, query } from '$app/server';

export const getUsers = query(async (offset = 0, limit = 25) => {
	const { locals } = getRequestEvent();
	if (!locals.session) {
		redirect(302, '/login');
	}

	const db = getDBFromEnv();

	return await db
		.select({
			id: users.id,
			email: users.email,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt
		})
		.from(users)
		.orderBy(desc(users.createdAt))
		.offset(offset)
		.limit(limit);
});
