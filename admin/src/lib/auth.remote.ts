import { error, redirect } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import * as v from 'valibot';

import { clearTokens, protectedQuery, storeTokens } from './auth-helpers';
import { getDBFromEnv } from './server/db/db';
import { users } from './server/db/schema';

import { form, getRequestEvent } from '$app/server';

const loginSchema = v.object({
	email: v.pipe(
		v.string('email must be a string'),
		v.nonEmpty('email must not be empty'),
		v.email('invalid email')
	),
	password: v.pipe(
		v.string('password must be a string'),
		v.minLength(8, 'password must be at least 8 characters long')
	)
});

export const login = form(loginSchema, async ({ email, password }) => {
	const event = getRequestEvent();
	const env = event.platform?.env;

	if (!env) {
		error(500, 'env unavailable');
	}

	const { success, data, error: e } = await env.AUTH.login(email, password);

	if (!success) {
		if (e.code === 'INVALID_CREDENTIALS') {
			error(401, e.message);
		}

		error(500, e.message);
	}

	const { accessToken, refreshToken } = data;

	storeTokens(accessToken, refreshToken);

	redirect(301, '/admin');
});

const RegisterSchema = v.pipe(
	v.object({
		email: v.pipe(
			v.string('email must be a string'),
			v.nonEmpty('email must not be empty'),
			v.email('invalid email')
		),
		displayName: v.pipe(
			v.string('display name must be a string'),
			v.minLength(3, 'display name must be at least 3 characters')
		),
		firstName: v.string(),
		lastName: v.string(),
		password: v.pipe(
			v.string('password must be a string'),
			v.minLength(8, 'password must be at least 8 characters long')
		),
		password2: v.pipe(
			v.string('password must be a string'),
			v.minLength(8, 'password must be at least 8 characters long')
		)
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['password2']],
			(input) => input.password === input.password2,
			"Password confirmation doesn't match password"
		),
		['password2']
	)
);

export const register = form(
	RegisterSchema,
	async ({ email, password, displayName, firstName, lastName }) => {
		const event = getRequestEvent();
		const env = event.platform?.env;
		if (!env) {
			error(500, 'env unavailable');
		}

		const { success, data, error: e } = await env.AUTH.register(email, password);

		if (!success) {
			if (e.code === 'USER_EXISTS') {
				error(400, 'bad credentials');
			}
			error(500, 'unexpected service error');
		}

		const db = drizzle(env.DB);
		await db.insert(users).values({
			id: data.user.id,
			email,
			firstName,
			lastName,
			displayName
		});

		const { accessToken, refreshToken } = data;

		storeTokens(accessToken, refreshToken);

		redirect(300, '/admin');
	}
);

export const logout = form(async () => {
	const { cookies, platform } = getRequestEvent();
	const env = platform?.env;
	if (!env) {
		error(500, 'env unavailable');
	}

	const refreshToken = cookies.get('refresh_token');
	if (!refreshToken) {
		error(401, 'unauthorized');
	}

	await env.AUTH.logout(refreshToken);
	clearTokens();

	redirect(300, '/login');
});

export const getCurrentUser = protectedQuery(async () => {
	const { locals } = getRequestEvent();
	const id = locals.session?.id;
	if (id) {
		const db = getDBFromEnv();
		const user = await db.query.users.findFirst({
			where: (t, { eq }) => eq(t.id, id),
			columns: { displayName: true, firstName: true, lastName: true, email: true }
		});
		return user;
	}
	return null;
});
