// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: {
				email: string;
				id: string;
				expires: number;
				iat: number;
			} | null;
			refreshToken: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
		}
	}
}

export {};
