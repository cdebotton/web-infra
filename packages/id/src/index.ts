export function generateULID(): string {
  const timestamp = Date.now();
  const randomness = new Uint8Array(10);
  crypto.getRandomValues(randomness);

  // Crockford's Base32 alphabet (excludes I, L, O, U to avoid confusion)
  const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  let ulid = "";

  // Encode timestamp (48 bits, 10 characters)
  let time = timestamp;
  for (let i = 9; i >= 0; i--) {
    ulid = ENCODING.charAt(time & 0x1f) + ulid;
    time = Math.floor(time / 32);
  }

  // Encode randomness (80 bits, 16 characters)
  let rand = randomness;
  for (let i = 0; i < 16; i++) {
    const byteIndex = Math.floor((i * 5) / 8);
    const bitOffset = (i * 5) % 8;

    let value: number;
    if (bitOffset <= 3) {
      value = (rand[byteIndex] >> (3 - bitOffset)) & 0x1f;
    } else {
      value = (rand[byteIndex] << (bitOffset - 3)) & 0x1f;
      if (byteIndex + 1 < rand.length) {
        value |= rand[byteIndex + 1] >> (11 - bitOffset);
      }
    }

    ulid += ENCODING.charAt(value);
  }

  return ulid;
}
