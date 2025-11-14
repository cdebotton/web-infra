import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { getDBFromEnv } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema';

import { form, getRequestEvent, query } from '$app/server';

export const getUser = query(v.string(), async (userId) => {
	const { locals } = getRequestEvent();
	if (!locals.session) {
		redirect(301, '/login');
	}

	const db = getDBFromEnv();
	const [user] = await db
		.select({ email: users.email, displayName: users.displayName })
		.from(users)
		.limit(1)
		.where(eq(users.id, userId));

	if (!user) {
		error(404, 'user not found');
	}

	return user;
});

const updateSchema = v.object({
	display_name: v.string(),
	avatar: v.file()
});

export const updateUser = form(updateSchema, async (data) => {
	const { locals, platform } = getRequestEvent();
	if (!locals.session) {
		redirect(301, '/login');
	}

	if (!platform?.env) {
		error(500, 'platform unavailable');
	}

	// platform.env.AVATARS_BUCKET.put()
});
