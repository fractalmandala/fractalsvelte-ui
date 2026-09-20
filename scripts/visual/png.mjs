/**
 * Minimal PNG decode/encode — color type 2 (RGB) and 6 (RGBA), 8-bit depth,
 * filters 0–4. Enough for Chrome's `Page.captureScreenshot` output without
 * pulling in an image dependency. Also exposes a fast RGB-diff helper.
 */
import { deflateSync, inflateSync } from 'node:zlib';

const CRC_TABLE = (() => {
	const table = new Int32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c;
	}
	return table;
})();

function crc32(buf) {
	let c = -1;
	for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
	return (c ^ -1) >>> 0;
}

function chunk(type, data) {
	const out = Buffer.alloc(12 + data.length);
	out.writeUInt32BE(data.length, 0);
	out.write(type, 4, 'ascii');
	data.copy(out, 8);
	out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
	return out;
}

/** @returns {{ width: number, height: number, pixels: Uint8Array, channels: number }} */
export function decodePng(buffer) {
	const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
	if (!buffer.subarray(0, 8).equals(signature)) throw new Error('not a PNG file');

	let pos = 8;
	let width = 0;
	let height = 0;
	let bitDepth = 0;
	let colorType = 0;
	const idat = [];

	while (pos < buffer.length) {
		const len = buffer.readUInt32BE(pos);
		const type = buffer.toString('ascii', pos + 4, pos + 8);
		const data = buffer.subarray(pos + 8, pos + 8 + len);
		if (type === 'IHDR') {
			width = data.readUInt32BE(0);
			height = data.readUInt32BE(4);
			bitDepth = data[8];
			colorType = data[9];
		} else if (type === 'IDAT') {
			idat.push(data);
		} else if (type === 'IEND') {
			break;
		}
		pos += 12 + len;
	}

	if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`);
	if (colorType !== 2 && colorType !== 6) throw new Error(`unsupported color type ${colorType}`);
	const channels = colorType === 6 ? 4 : 3;

	const raw = inflateSync(Buffer.concat(idat));
	const stride = width * channels;
	const pixels = new Uint8Array(width * height * channels);

	// Undo per-scanline filters (PNG spec: filters operate on bytes including alpha).
	const bpp = channels;
	for (let y = 0; y < height; y++) {
		const filter = raw[y * (stride + 1)];
		const rowStart = y * (stride + 1) + 1;
		const row = raw.subarray(rowStart, rowStart + stride);
		const outRow = y * stride;
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? pixels[outRow + x - bpp] : 0;
			const b = y > 0 ? pixels[outRow - stride + x] : 0;
			const c = x >= bpp && y > 0 ? pixels[outRow - stride + x - bpp] : 0;
			let value = row[x];
			if (filter === 1) value = (value + a) & 0xff;
			else if (filter === 2) value = (value + b) & 0xff;
			else if (filter === 3) value = (value + ((a + b) >> 1)) & 0xff;
			else if (filter === 4) {
				const p = a + b - c;
				const pa = Math.abs(p - a);
				const pb = Math.abs(p - b);
				const pc = Math.abs(p - c);
				value = (value + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
			}
			pixels[outRow + x] = value;
		}
	}

	return { width, height, pixels, channels };
}

/** Encode RGBA pixels as a PNG. */
export function encodePng(width, height, rgba) {
	const stride = width * 4;
	const raw = Buffer.alloc((stride + 1) * height);
	for (let y = 0; y < height; y++) {
		raw[y * (stride + 1)] = 0; // filter: none
		Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
	}
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 6; // color type RGBA
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk('IHDR', ihdr),
		chunk('IDAT', deflateSync(raw, { level: 6 })),
		chunk('IEND', Buffer.alloc(0))
	]);
}

/**
 * Compare two decoded images. Returns null when identical within `tolerance`
 * (0–255 per channel); otherwise a masked RGBA diff image plus stats.
 */
export function diffImages(a, b, tolerance = 0) {
	if (a.width !== b.width || a.height !== b.height) {
		return { different: true, changedPixels: -1, totalPixels: a.width * a.height, diffRgba: null };
	}
	const n = a.width * a.height * 4;
	const toRgba = (img) => {
		if (img.channels === 4) return img.pixels;
		const out = new Uint8Array(n);
		for (let i = 0, j = 0; i < img.pixels.length; i += 3, j += 4) {
			out[j] = img.pixels[i];
			out[j + 1] = img.pixels[i + 1];
			out[j + 2] = img.pixels[i + 2];
			out[j + 3] = 255;
		}
		return out;
	};
	const pa = toRgba(a);
	const pb = toRgba(b);
	const diff = new Uint8Array(n);
	let changed = 0;
	for (let i = 0; i < n; i += 4) {
		const d = Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2]));
		if (d > tolerance) {
			changed++;
			// paint the changed pixel red, everything else transparent
			diff[i] = 255;
			diff[i + 3] = 255;
		}
	}
	return { different: changed > 0, changedPixels: changed, totalPixels: a.width * a.height, diffRgba: diff };
}
