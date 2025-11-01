export async function createJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: number,
) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1_000);
  const jwtPayload = { ...payload, iat: now, exp: now + expiresIn };

  const encoder = new TextEncoder();
  const headerB64 = base64URLEncode(JSON.stringify(header));
  const payloadB64 = base64URLEncode(JSON.stringify(jwtPayload));

  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const signatureB64 = base64URLEncode(signature);

  return `${data}.${signatureB64}`;
}

function base64URLEncode(data: ArrayBuffer | string) {
  let str: string;
  if (data instanceof ArrayBuffer) {
    str = String.fromCharCode(...new Uint8Array(data));
  } else {
    str = data;
  }

  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    const data = `${headerB64}.${payloadB64}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const signature = base64URLDecode(signatureB64);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(data),
    );

    if (!valid) {
      return null;
    }

    const payloadStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function base64URLDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }

  const binary = atob(str);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
