import * as v from 'valibot';

export function generateSecureToken() {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);

	return Array.from(array, (byte) => {
		return byte.toString(16).padStart(2, '0');
	}).join('');
}

export async function addTokenToFamily(env: Env, tokenFamily: string, token: string) {
	let tokens: Array<string>;
	try {
		const tokenStr = await env.TOKEN_FAMILIES.get(tokenFamily);
		tokens = tokenStr ? JSON.parse(tokenStr) : [];
	} catch {
		tokens = [];
	}
	tokens.push(token);
	await env.TOKEN_FAMILIES.put(tokenFamily, JSON.stringify(tokens), {
		expirationTtl: 7 * 24 * 60 * 60,
	});
}

export async function removeTokenFromFamily(env: Env, tokenFamily: string, token: string) {
	const tokenStr = await env.TOKEN_FAMILIES.get(tokenFamily);
	if (!tokenStr) {
		return;
	}
	const tokens = v.safeParse(v.array(v.string()), JSON.parse(tokenStr));
	if (!tokens.success) {
		return;
	}

	const filtered = tokens.output.filter((t) => t !== token);
	if (filtered.length > 0) {
		await env.TOKEN_FAMILIES.put(tokenFamily, JSON.stringify(filtered), {
			expirationTtl: 7 * 24 * 60 * 60,
		});
	} else {
		await env.TOKEN_FAMILIES.delete(tokenFamily);
	}
}

export async function revokeTokenFamily(env: Env, tokenFamily: string) {
	const tokenStr = await env.TOKEN_FAMILIES.get(tokenFamily);
	if (!tokenStr) {
		return;
	}

	const tokens = v.safeParse(v.array(v.string()), JSON.parse(tokenStr));
	if (!tokens.success) {
		return;
	}

	for (const token of tokens.output) {
		const tokenData = await env.REFRESH_TOKENS.get(token);
		if (tokenData) {
			await env.REFRESH_TOKENS.delete(token);
			const { userId } = JSON.parse(tokenData);
			await removeUserToken(env, userId, token);
		}
	}

	await env.TOKEN_FAMILIES.delete(tokenFamily);

	console.log(`Revoked ${tokens.output.length} tokens frmo family ${tokenFamily}`);
}

export async function addUserToken(env: Env, userId: string, token: string) {
	let tokens: Array<string>;
	try {
		const tokenStr = await env.USER_TOKENS.get(userId);
		tokens = tokenStr ? JSON.parse(tokenStr) : [];
	} catch {
		tokens = [];
	}
	tokens.push(token);
	await env.USER_TOKENS.put(userId, JSON.stringify(tokens), { expirationTtl: 7 * 24 * 60 * 60 });
}

export async function removeUserToken(env: Env, userId: string, token: string) {
	const tokenStr = await env.USER_TOKENS.get(userId);
	if (!tokenStr) {
		return;
	}

	const tokens = v.safeParse(v.array(v.string()), JSON.parse(tokenStr));
	if (!tokens.success) {
		return;
	}
	const filtered = tokens.output.filter((t) => t !== token);

	if (filtered.length > 0) {
		await env.USER_TOKENS.put(userId, JSON.stringify(filtered), {
			expirationTtl: 7 * 24 * 60 * 60,
		});
	} else {
		await env.USER_TOKENS.delete(userId);
	}
}

export async function revokeAllUserTokens(env: Env, userId: string) {
	const tokenStr = await env.USER_TOKENS.get(userId);
	if (!tokenStr) {
		return;
	}

	const tokens = v.safeParse(v.array(v.string()), JSON.parse(tokenStr));
	if (!tokens.success) {
		return;
	}

	for (const token of tokens.output) {
		await env.REFRESH_TOKENS.delete(token);
	}

	await env.USER_TOKENS.delete(userId);

	console.log(`Revoked ${tokens.output.length} tokens for user ${userId}`);
}
