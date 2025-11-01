import { WorkerEntrypoint } from 'cloudflare:workers';
import { database } from './db/db';
import { eq } from 'drizzle-orm';
import { users } from './db/schema';
import { hashPassword, verifyPassword } from './password';
import { addTokenToFamily, addUserToken, generateSecureToken, removeTokenFromFamily, removeUserToken } from './tokens';
import * as v from 'valibot';
import { createJWT } from '@cdb/jwt';

interface RPCSuccessResponse<Data> {
	success: true;
	data: Data;
	error: null;
}

interface RPCFailureResponse<Code = Readonly<string>> {
	success: false;
	data: null;
	error: {
		code: Code;
		message: string;
	};
}

function makeError<Code>(code: Code, message: string): RPCFailureResponse<Code> {
	return {
		success: false,
		error: { code, message },
		data: null,
	};
}

function makeSuccess<Data>(data: Data): RPCSuccessResponse<Data> {
	return { success: true, data, error: null };
}

export default class extends WorkerEntrypoint {
	async login(email: string, password: string) {
		const db = database(this.env);

		const user = await db.query.users.findFirst({
			where: (t, { eq }) => eq(t.email, email),
			columns: { id: true, passwordHash: true, email: true },
		});

		if (!user) {
			return makeError('INVALID_CREDENTIALS' as const, 'Invalid Credentials');
		}

		const verified = await verifyPassword(password, user.passwordHash);
		if (!verified) {
			return makeError('INVALID_CREDENTIALS' as const, 'Invalid Credentials');
		}
		return createSession(this.env, user.id, user.email);
	}

	async register(email: string, password: string) {
		const db = database(this.env);
		const [existingUser] = await db.select().from(users).where(eq(users.email, email));
		if (existingUser) {
			return makeError('USER_EXISTS' as const, 'bad input');
		}
		const userId = crypto.randomUUID();
		const passwordHash = await hashPassword(password);

		try {
			await db.insert(users).values({
				id: userId,
				email: email.toLowerCase(),
				passwordHash,
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : 'error inserting user';
			return makeError('DB_INSERT_USER_ERROR' as const, message);
		}

		return await createSession(this.env, userId, email);
	}

	async logout(refreshToken: string) {
		const tokenDataStr = await this.env.REFRESH_TOKENS.get(refreshToken);

		if (!tokenDataStr) {
			return { success: false, error: 'invalid_token' };
		}

		const { userId, tokenFamily } = v.parse(
			v.object({
				userId: v.string(),
				tokenFamily: v.string(),
			}),
			JSON.parse(tokenDataStr),
		);

		await this.env.REFRESH_TOKENS.delete(refreshToken);
		await removeUserToken(this.env, userId, refreshToken);
		await removeTokenFromFamily(this.env, tokenFamily, refreshToken);
	}

	async refresh(refreshToken: string) {
		const tokenDataStr = await this.env.REFRESH_TOKENS.get(refreshToken);
		if (!tokenDataStr) {
			// handle token reuse
			return makeError('INVALID_TOKEN', 'invalid refresh token');
		}

		const tokenData = v.parse(
			v.object({
				userId: v.string(),
				email: v.pipe(v.string(), v.email()),
				tokenFamily: v.string(),
			}),
			JSON.parse(tokenDataStr),
		);

		const { userId, email, tokenFamily } = tokenData;
		const db = database(this.env);
		const user = await db.query.users.findFirst({
			where: (t, { eq }) => eq(t.email, email),
		});

		if (!user) {
			await this.env.REFRESH_TOKENS.delete(refreshToken);
			return makeError('INVALID_CREDENTIALS', 'invalid credentials');
		}

		await removeUserToken(this.env, userId, refreshToken);
		await removeTokenFromFamily(this.env, tokenFamily, refreshToken);

		await this.env.REFRESH_TOKENS.delete(refreshToken);

		const newRefreshToken = generateSecureToken();
		const secret = await this.env.AUTH_JWT_SECRET.get();
		const newAccessToken = await createJWT({ id: userId, email }, secret, 60 * 5);
		const now = Date.now();
		await this.env.REFRESH_TOKENS.put(newRefreshToken, JSON.stringify({ userId, email, tokenFamily, createdAt: now }), {
			expirationTtl: 7 * 24 * 60 * 60,
		});

		await addUserToken(this.env, userId, newRefreshToken);
		await addTokenToFamily(this.env, tokenFamily, newRefreshToken);

		return makeSuccess({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	}
}

async function createSession(env: Env, id: string, email: string) {
	const tokenFamily = crypto.randomUUID();
	const secret = await env.AUTH_JWT_SECRET.get();
	const accessToken = await createJWT({ id, email: email.toLowerCase() }, secret, 30);
	const refreshToken = generateSecureToken();
	const now = Date.now();

	try {
		await env.REFRESH_TOKENS.put(refreshToken, JSON.stringify({ userId: id, email: email.toLowerCase(), tokenFamily, createdAt: now }), {
			expirationTtl: 7 * 24 * 60 * 60,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'error inserting refresh token';
		return makeError('KV_INSERT_REFRESH_TOKEN_ERROR' as const, message);
	}

	try {
		await addUserToken(env, id, refreshToken);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'error adding user tokens';
		return makeError('KV_INSERT_USER_TOKENS_ERROR' as const, message);
	}

	try {
		await addTokenToFamily(env, tokenFamily, refreshToken);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'error adding user tokens';
		return makeError('KV_INSERT_TOKEN_FAMILY_ERROR' as const, message);
	}

	return makeSuccess({
		accessToken,
		refreshToken,
		user: { id, email: email.toLocaleLowerCase() },
	});
}
