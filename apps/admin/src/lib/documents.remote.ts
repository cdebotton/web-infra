import { error } from '@sveltejs/kit';

import { refresh, verifyJWT } from './server/auth/tokens';

import { getRequestEvent, query } from '$app/server';

export const getDocuments = query(async () => {
	const { cookies, platform } = getRequestEvent();
	const env = platform?.env;
	if (!env) {
		error(500, 'env unavailable');
	}
	let accessToken = cookies.get('access_token');
	let refreshToken = cookies.get('refresh_token');
	if (!accessToken && !refreshToken) {
		error(401, 'unauthorized');
	}

	if (!accessToken && refreshToken) {
		const result = await refresh(refreshToken);
		accessToken = result.accessToken;
		refreshToken = result.refreshToken;
	}

	if (!accessToken || !refreshToken) {
		error(401, 'unauthorized');
	}

	const validToken = await verifyJWT(accessToken, env.AUTH_JWT_SECRET);
	if (!validToken) {
		({ accessToken, refreshToken } = await refresh(refreshToken));
	}
});
