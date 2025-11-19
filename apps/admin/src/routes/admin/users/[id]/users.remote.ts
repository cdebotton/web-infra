import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { getDBFromEnv } from '$lib/server/db/db';
import { assets, users } from '$lib/server/db/schema';

import { form, getRequestEvent, query } from '$app/server';

export const getUser = query(v.optional(v.string()), async (userId) => {
	if (!userId) {
		error(404, 'user not found');
	}

	const { locals } = getRequestEvent();
	if (!locals.session) {
		redirect(301, '/login');
	}

	const db = getDBFromEnv();
	const [user] = await db
		.select({ email: users.email, displayName: users.displayName, key: assets.key })
		.from(users)
		.leftJoin(assets, eq(assets.id, users.avatarId))
		.limit(1)
		.where(eq(users.id, userId));

	if (!user) {
		error(404, 'user not found');
	}

	return user;
});

const updateSchema = v.object({
	userId: v.string(),
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

	const db = getDBFromEnv();
	await db
		.update(users)
		.set({
			displayName: data.display_name
		})
		.where(eq(users.id, data.userId));

	// platform.env.AVATARS_BUCKET.put()
});
