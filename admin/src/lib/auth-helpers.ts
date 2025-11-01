import { redirect } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { getRequestEvent, query } from '$app/server';

export function protectedQuery<T>(callback: () => Promise<T>) {
	return query(async () => {
		const { locals, url } = getRequestEvent();

		if (locals.session) {
			return await callback();
		}

		redirect(301, `/login?redirect_to=${encodeURIComponent(url.pathname)}`);
	});
}

export function storeTokens(accessToken: string, refreshToken: string) {
	const { cookies } = getRequestEvent();

	cookies.set('access_token', accessToken, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax'
	});

	cookies.set('refresh_token', refreshToken, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax'
	});
}

export function clearTokens() {
	const { cookies } = getRequestEvent();

	cookies.delete('access_token', {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax'
	});

	cookies.delete('refresh_token', {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax'
	});
}
