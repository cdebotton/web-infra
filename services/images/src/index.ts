import { WorkerEntrypoint } from 'cloudflare:workers';

export default class ImageService extends WorkerEntrypoint {
	async put(key: string, stream: ReadableStream) {
		this.env.IMAGES.put(key, stream);
	}
}

type AllowedFileType = 'jpg' | 'jpeg' | 'png' | 'gif' | 'avif' | 'webm';

interface FileTypeInfo {
	ext: string;
	mime: string;
}

class FileTypeValidatorStream extends TransformStream<Uint8Array, Uint8Array> {
	#allowedTypes: Set<AllowedFileType>;

	constructor(allowedTypes: Array<AllowedFileType> = ['jpg', 'png', 'gif', 'avif', 'webm']) {
		let isFirstChunk = true;
		const allowedTypeSet = new Set(allowedTypes);

		super({
			transform(chunk: Uint8Array, controller: TransformStreamDefaultController<Uint8Array>) {
				if (isFirstChunk) {
					isFirstChunk = false;
					const fileType = detectFileType(chunk);

					if (!fileType) {
						controller.error(new Error('could not derermine file type'));
						return;
					}

					const normalizedExt = fileType.ext === 'jpg' ? 'jpeg' : fileType.ext;
					if (!allowedTypeSet.has(normalizedExt) && !allowedTypeSet.has(fileType.ext)) {
						controller.error(new Error(`file type ${fileType.ext} is not allowed`));
						return;
					}
				}

				controller.enqueue(chunk);
			},
		});

		this.#allowedTypes = allowedTypeSet;
	}
}

function detectFileType(bytes: Uint8Array): FileTypeInfo | null {
	if (bytes.length < 4) {
		return null;
	}

	// JPEG: FF D8 FF
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
		return { ext: 'jpg', mime: 'image/jpeg' };
	}
	// PNG: 89 50 4E 47 0D 0A 1A 0A
	if (bytes[0] == 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
		return { ext: 'png', mime: 'image/png' };
	}
	// GIF: 47 49 46 38
	if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
		return { ext: 'gif', mime: 'image/gif' };
	}
	// WEBP: RIFF at bytes 0-3 and WEBP at bytes 8-11
	if (bytes.length >= 12) {
		const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
		const webp = String.fromCharCode((bytes[8], bytes[9], bytes[10], bytes[11]));
		if (riff === 'RIFF' && webp === 'WEBP') {
			return { ext: 'webp', mime: 'image/webp' };
		}
	}

	// AVIF: Check for 'ftyp' at bytes 4-7 and 'avif' at bytes 8-11
	if (bytes.length >= 12) {
		const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
		const avif = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
		if (ftyp === 'ftyp' && avif === 'avif') {
			return { ext: 'avif', mime: 'image/avif' };
		}
	}

	return null;
}
