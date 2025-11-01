const SALT_LEN = 16;

export async function hashPassword(password: string) {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
	const encoder = new TextEncoder();
	const passwordData = encoder.encode(password);
	const keyMaterial = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, [
		'deriveBits'
	]);
	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100_000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);
	const hashArray = new Uint8Array(derivedBits);
	const combined = new Uint8Array(salt.length + hashArray.length);
	combined.set(salt, 0);
	combined.set(hashArray, salt.length);

	return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(password: string, hashedPassword: string) {
	const combined = Uint8Array.from(atob(hashedPassword), (c) => c.charCodeAt(0));
	const salt = combined.slice(0, SALT_LEN);
	const storedHash = combined.slice(SALT_LEN);

	const encoder = new TextEncoder();
	const passwordData = encoder.encode(password);

	const keyMaterial = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, [
		'deriveBits'
	]);
	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100_000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);

	const derivedHash = new Uint8Array(derivedBits);
	if (derivedHash.length !== storedHash.length) {
		return false;
	}

	let diff = 0;
	for (let i = 0; i < derivedHash.length; i += 1) {
		diff |= derivedHash[i] ^ storedHash[i];
	}

	return diff === 0;
}
