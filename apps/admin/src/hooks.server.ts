import { verifyJWT } from '@cdb/jwt';
import { type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { clearTokens, storeTokens } from '$lib/auth-helpers';

const handleAuth: Handle = async ({ event, resolve }) => {
	const { cookies, platform } = event;
	const env = platform?.env;

	if (!env) {
		error(500, 'env not available');
	}

	const secret = await env.AUTH_JWT_SECRET.get();
	const jwt = cookies.get('access_token');
	let refresh = cookies.get('refresh_token');

	if (secret && jwt && refresh) {
		let session = await verifyJWT(jwt, secret);

		if (!session) {
			const { success, data } = await env.AUTH.refresh(refresh);
			if (success) {
				storeTokens(data.accessToken, data.refreshToken);
				session = await verifyJWT(data.accessToken, secret);
				refresh = data.refreshToken;
			} else {
				clearTokens();
			}
		}

		event.locals.session = session;
		event.locals.refreshToken = refresh;
	} else {
		event.locals.session = null;
		event.locals.refreshToken = null;
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth);
