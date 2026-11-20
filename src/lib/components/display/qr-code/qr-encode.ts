/**
 * QR Code encoder.
 *
 * Adapted from `uqr` (MIT, © Anthony Fu), itself derived from Project Nayuki's
 * QR Code generator (MIT). See THIRD_PARTY_NOTICES.md.
 */

/** Error-correction level, lowest to highest redunancy. */
export type QrCodeEcc = 'L' | 'M' | 'Q' | 'H';

interface EccLevel {
	/** Row index into the two per-block tables. */
	table: number;
	/** The three format bits this level writes. */
	formatBits: number;
}

/** One run of encoded text in a single mode. */
interface Segment {
	mode: number[];
	numChars: number;
	bits: number[];
}

/** What `qrEncode` returns: the module matrix plus how it was decided. */
export interface QrMatrix {
	/** Rows and columns, border included. */
	size: number;
	/** `data[row][col]` — true is a dark module. */
	data: boolean[][];
	version: number;
	maskPattern: number;
	ecc: QrCodeEcc;
}

export interface QrEncodeOptions {
	/** Error correction. Default `L`. */
	ecc?: QrCodeEcc;
	/** Use the highest level that still fits. Default `false`. */
	boostEcc?: boolean;
	/** Default 1. */
	minVersion?: number;
	/** Default 40. */
	maxVersion?: number;
	/** -1 picks the best mask by penalty. Default -1. */
	maskPattern?: number;
	/** Quiet zone, in modules. Default 1. */
	border?: number;
}

const MIN_VERSION = 1;
const MAX_VERSION = 40;

const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;

const NUMERIC_REGEX = /^\d*$/;
const ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+./:-]*$/;
const ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

const ECC_LEVELS: Record<QrCodeEcc, EccLevel> = {
	L: { table: 0, formatBits: 1 },
	M: { table: 1, formatBits: 0 },
	Q: { table: 2, formatBits: 3 },
	H: { table: 3, formatBits: 2 }
};

// Error-correction codewords per block, indexed by [level][version].
const ECC_CODEWORDS_PER_BLOCK: number[][] = [
	[-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	[-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
	[-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	[-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
];

// Number of error-correction blocks, indexed by [level][version].
const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
	[-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
	[-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
	[-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
	[-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
];

const MODE_NUMERIC: number[] = [1, 10, 12, 14];
const MODE_ALPHANUMERIC: number[] = [2, 9, 11, 13];
const MODE_BYTE: number[] = [4, 8, 16, 16];

function charCountBits(mode: number[], version: number): number {
	return mode[Math.floor((version + 7) / 17) + 1];
}

function appendBits(value: number, length: number, buffer: number[]): void {
	if (length < 0 || length > 31 || value >>> length !== 0) {
		throw new RangeError('Value out of range');
	}

	for (let i = length - 1; i >= 0; i--) buffer.push((value >>> i) & 1);
}

function getBit(value: number, index: number): boolean {
	return ((value >>> index) & 1) !== 0;
}

function rawDataModules(version: number): number {
	if (version < MIN_VERSION || version > MAX_VERSION) {
		throw new RangeError('Version number out of range');
	}

	let result = (16 * version + 128) * version + 64;

	if (version >= 2) {
		const numAlign = Math.floor(version / 7) + 2;

		result -= (25 * numAlign - 10) * numAlign - 55;
		if (version >= 7) result -= 36;
	}

	return result;
}

function dataCodewords(version: number, level: EccLevel): number {
	const raw = Math.floor(rawDataModules(version) / 8);

	return (
		raw -
		ECC_CODEWORDS_PER_BLOCK[level.table][version] * NUM_ERROR_CORRECTION_BLOCKS[level.table][version]
	);
}

function utf8Bytes(text: string): number[] {
	return Array.from(new TextEncoder().encode(text));
}

function makeSegments(text: string): Segment[] {
	if (text === '') return [];

	if (NUMERIC_REGEX.test(text)) {
		const bits: number[] = [];

		for (let i = 0; i < text.length; ) {
			const n = Math.min(text.length - i, 3);

			appendBits(Number.parseInt(text.substring(i, i + n), 10), n * 3 + 1, bits);
			i += n;
		}

		return [{ mode: MODE_NUMERIC, numChars: text.length, bits }];
	}

	if (ALPHANUMERIC_REGEX.test(text)) {
		const bits: number[] = [];
		let i = 0;

		for (; i + 2 <= text.length; i += 2) {
			const pair =
				ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45 +
				ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));

			appendBits(pair, 11, bits);
		}

		if (i < text.length) appendBits(ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bits);

		return [{ mode: MODE_ALPHANUMERIC, numChars: text.length, bits }];
	}

	const bytes = utf8Bytes(text);
	const bits: number[] = [];

	for (const byte of bytes) appendBits(byte, 8, bits);

	return [{ mode: MODE_BYTE, numChars: bytes.length, bits }];
}

function totalBits(segments: Segment[], version: number): number {
	let result = 0;

	for (const segment of segments) {
		const ccBits = charCountBits(segment.mode, version);

		if (segment.numChars >= 1 << ccBits) return Number.POSITIVE_INFINITY;
		result += 4 + ccBits + segment.bits.length;
	}

	return result;
}

function reedSolomonMultiply(x: number, y: number): number {
	if (x >>> 8 !== 0 || y >>> 8 !== 0) throw new RangeError('Byte out of range');

	let z = 0;

	for (let i = 7; i >= 0; i--) {
		z = (z << 1) ^ ((z >>> 7) * 0x11d);
		z ^= ((y >>> i) & 1) * x;
	}

	return z;
}

function reedSolomonDivisor(degree: number): number[] {
	const result: number[] = new Array(degree - 1).fill(0);

	result.push(1);

	let root = 1;

	for (let i = 0; i < degree; i++) {
		for (let j = 0; j < result.length; j++) {
			result[j] = reedSolomonMultiply(result[j], root);
			if (j + 1 < result.length) result[j] ^= result[j + 1];
		}

		root = reedSolomonMultiply(root, 2);
	}

	return result;
}

function reedSolomonRemainder(data: number[], divisor: number[]): number[] {
	const result: number[] = divisor.map(() => 0);

	for (const byte of data) {
		const factor = byte ^ (result.shift() as number);

		result.push(0);
		divisor.forEach((coefficient, index) => {
			result[index] ^= reedSolomonMultiply(coefficient, factor);
		});
	}

	return result;
}

class QrSymbol {
	version: number;
	level: EccLevel;
	size: number;
	modules: boolean[][];
	reserved: boolean[][];
	mask = 0;

	constructor(version: number, level: EccLevel, codewords: number[], mask: number) {
		this.version = version;
		this.level = level;
		this.size = version * 4 + 17;
		this.modules = Array.from({ length: this.size }, () => new Array<boolean>(this.size).fill(false));
		this.reserved = Array.from({ length: this.size }, () => new Array<boolean>(this.size).fill(false));
		this.drawFunctionPatterns();
		this.drawCodewords(this.addEccAndInterleave(codewords));

		if (mask === -1) {
			let bestPenalty = Number.POSITIVE_INFINITY;

			for (let candidate = 0; candidate < 8; candidate++) {
				this.applyMask(candidate);
				this.drawFormatBits(candidate);

				const penalty = this.penaltyScore();

				if (penalty < bestPenalty) {
					mask = candidate;
					bestPenalty = penalty;
				}

				this.applyMask(candidate);
			}
		}

		this.mask = mask;
		this.applyMask(mask);
		this.drawFormatBits(mask);
	}

	setFunction(x: number, y: number, dark: boolean): void {
		this.modules[y][x] = dark;
		this.reserved[y][x] = true;
	}

	drawFunctionPatterns(): void {
		for (let i = 0; i < this.size; i++) {
			this.setFunction(6, i, i % 2 === 0);
			this.setFunction(i, 6, i % 2 === 0);
		}

		this.drawFinder(3, 3);
		this.drawFinder(this.size - 4, 3);
		this.drawFinder(3, this.size - 4);

		const positions = this.alignmentPatternPositions();

		for (let i = 0; i < positions.length; i++) {
			for (let j = 0; j < positions.length; j++) {
				const corner =
					(i === 0 && j === 0) ||
					(i === 0 && j === positions.length - 1) ||
					(i === positions.length - 1 && j === 0);

				if (!corner) this.drawAlignment(positions[i], positions[j]);
			}
		}

		this.drawFormatBits(0);
		this.drawVersionBits();
	}

	drawFormatBits(mask: number): void {
		const data = (this.level.formatBits << 3) | mask;
		let remainder = data;

		for (let i = 0; i < 10; i++) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);

		const bits = ((data << 10) | remainder) ^ 0x5412;

		for (let i = 0; i <= 5; i++) this.setFunction(8, i, getBit(bits, i));
		this.setFunction(8, 7, getBit(bits, 6));
		this.setFunction(8, 8, getBit(bits, 7));
		this.setFunction(7, 8, getBit(bits, 8));
		for (let i = 9; i < 15; i++) this.setFunction(14 - i, 8, getBit(bits, i));
		for (let i = 0; i < 8; i++) this.setFunction(this.size - 1 - i, 8, getBit(bits, i));
		for (let i = 8; i < 15; i++) this.setFunction(8, this.size - 15 + i, getBit(bits, i));
		this.setFunction(8, this.size - 8, true);
	}

	drawVersionBits(): void {
		if (this.version < 7) return;

		let remainder = this.version;

		for (let i = 0; i < 12; i++) remainder = (remainder << 1) ^ ((remainder >>> 11) * 0x1f25);

		const bits = (this.version << 12) | remainder;

		for (let i = 0; i < 18; i++) {
			const dark = getBit(bits, i);
			const a = this.size - 11 + (i % 3);
			const b = Math.floor(i / 3);

			this.setFunction(a, b, dark);
			this.setFunction(b, a, dark);
		}
	}

	drawFinder(x: number, y: number): void {
		for (let dy = -4; dy <= 4; dy++) {
			for (let dx = -4; dx <= 4; dx++) {
				const dist = Math.max(Math.abs(dx), Math.abs(dy));
				const xx = x + dx;
				const yy = y + dy;

				if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
					this.setFunction(xx, yy, dist !== 2 && dist !== 4);
				}
			}
		}
	}

	drawAlignment(x: number, y: number): void {
		for (let dy = -2; dy <= 2; dy++) {
			for (let dx = -2; dx <= 2; dx++) {
				this.setFunction(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
			}
		}
	}

	alignmentPatternPositions(): number[] {
		if (this.version === 1) return [];

		const count = Math.floor(this.version / 7) + 2;
		const step =
			this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (count * 2 - 2)) * 2;
		const result = [6];

		for (let pos = this.size - 7; result.length < count; pos -= step) result.splice(1, 0, pos);

		return result;
	}

	addEccAndInterleave(data: number[]): number[] {
		if (data.length !== dataCodewords(this.version, this.level)) {
			throw new RangeError('Invalid codeword length');
		}

		const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[this.level.table][this.version];
		const blockEccLength = ECC_CODEWORDS_PER_BLOCK[this.level.table][this.version];
		const rawCodewords = Math.floor(rawDataModules(this.version) / 8);
		const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
		const shortBlockLength = Math.floor(rawCodewords / numBlocks);
		const divisor = reedSolomonDivisor(blockEccLength);
		const blocks: number[][] = [];

		for (let i = 0, k = 0; i < numBlocks; i++) {
			const length = shortBlockLength - blockEccLength + (i < numShortBlocks ? 0 : 1);
			const block = data.slice(k, k + length);

			k += block.length;

			const ecc = reedSolomonRemainder(block, divisor);

			if (i < numShortBlocks) block.push(0);
			blocks.push(block.concat(ecc));
		}

		const result: number[] = [];

		for (let i = 0; i < blocks[0].length; i++) {
			blocks.forEach((block, j) => {
				if (i !== shortBlockLength - blockEccLength || j >= numShortBlocks) result.push(block[i]);
			});
		}

		return result;
	}

	drawCodewords(data: number[]): void {
		if (data.length !== Math.floor(rawDataModules(this.version) / 8)) {
			throw new RangeError('Invalid codeword length');
		}

		let i = 0;

		for (let right = this.size - 1; right >= 1; right -= 2) {
			if (right === 6) right = 5;

			for (let vert = 0; vert < this.size; vert++) {
				for (let j = 0; j < 2; j++) {
					const x = right - j;
					const upward = ((right + 1) & 2) === 0;
					const y = upward ? this.size - 1 - vert : vert;

					if (!this.reserved[y][x] && i < data.length * 8) {
						this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
						i++;
					}
				}
			}
		}
	}

	applyMask(mask: number): void {
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				if (this.reserved[y][x]) continue;

				let invert: boolean;

				switch (mask) {
					case 0:
						invert = (x + y) % 2 === 0;
						break;
					case 1:
						invert = y % 2 === 0;
						break;
					case 2:
						invert = x % 3 === 0;
						break;
					case 3:
						invert = (x + y) % 3 === 0;
						break;
					case 4:
						invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
						break;
					case 5:
						invert = ((x * y) % 2) + ((x * y) % 3) === 0;
						break;
					case 6:
						invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
						break;
					case 7:
						invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
						break;
					default:
						throw new RangeError('Mask value out of range');
				}

				if (invert) this.modules[y][x] = !this.modules[y][x];
			}
		}
	}

	penaltyScore(): number {
		let result = 0;

		const scan = (get: (a: number, b: number) => boolean): void => {
			for (let a = 0; a < this.size; a++) {
				let runColor = false;
				let runLength = 0;
				const history = [0, 0, 0, 0, 0, 0, 0];

				for (let b = 0; b < this.size; b++) {
					const color = get(a, b);

					if (color === runColor) {
						runLength++;
						if (runLength === 5) result += PENALTY_N1;
						else if (runLength > 5) result++;
					} else {
						this.addRunHistory(runLength, history);
						if (!runColor) result += this.countFinderPatterns(history) * PENALTY_N3;
						runColor = color;
						runLength = 1;
					}
				}

				result += this.terminateRun(runColor, runLength, history) * PENALTY_N3;
			}
		};

		scan((row, col) => this.modules[row][col]);
		scan((col, row) => this.modules[row][col]);

		for (let y = 0; y < this.size - 1; y++) {
			for (let x = 0; x < this.size - 1; x++) {
				const color = this.modules[y][x];

				if (
					color === this.modules[y][x + 1] &&
					color === this.modules[y + 1][x] &&
					color === this.modules[y + 1][x + 1]
				) {
					result += PENALTY_N2;
				}
			}
		}

		let dark = 0;

		for (const row of this.modules) for (const module of row) if (module) dark++;

		const total = this.size * this.size;
		const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;

		return result + k * PENALTY_N4;
	}

	countFinderPatterns(history: number[]): number {
		const n = history[1];
		const core = n > 0 && history[2] === n && history[3] === n * 3 && history[4] === n && history[5] === n;

		return (
			(core && history[0] >= n * 4 && history[6] >= n ? 1 : 0) +
			(core && history[6] >= n * 4 && history[0] >= n ? 1 : 0)
		);
	}

	terminateRun(color: boolean, length: number, history: number[]): number {
		let runLength = length;

		if (color) {
			this.addRunHistory(runLength, history);
			runLength = 0;
		}

		runLength += this.size;
		this.addRunHistory(runLength, history);

		return this.countFinderPatterns(history);
	}

	addRunHistory(length: number, history: number[]): void {
		if (history[0] === 0) length += this.size;

		history.pop();
		history.unshift(length);
	}
}

function buildSymbol(
	segments: Segment[],
	level: EccLevel,
	version: number,
	mask: number
): QrSymbol {
	const bitBuffer: number[] = [];

	for (const segment of segments) {
		appendBits(segment.mode[0], 4, bitBuffer);
		appendBits(segment.numChars, charCountBits(segment.mode, version), bitBuffer);
		bitBuffer.push(...segment.bits);
	}

	const capacity = dataCodewords(version, level) * 8;

	appendBits(0, Math.min(4, capacity - bitBuffer.length), bitBuffer);
	appendBits(0, (8 - (bitBuffer.length % 8)) % 8, bitBuffer);

	for (let padByte = 0xec; bitBuffer.length < capacity; padByte ^= 0xec ^ 0x11) {
		appendBits(padByte, 8, bitBuffer);
	}

	const codewords: number[] = new Array(Math.ceil(bitBuffer.length / 8)).fill(0);

	bitBuffer.forEach((bit, index) => {
		codewords[index >>> 3] |= bit << (7 - (index & 7));
	});

	return new QrSymbol(version, level, codewords, mask);
}

/** Encode `value` into a QR module matrix. */
export function qrEncode(value: string, encoding: QrEncodeOptions = {}): QrMatrix {
	const {
		ecc = 'L',
		boostEcc = false,
		minVersion = MIN_VERSION,
		maxVersion = MAX_VERSION,
		maskPattern = -1,
		border = 1
	} = encoding;

	if (!(MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= MAX_VERSION)) {
		throw new RangeError('Invalid version range');
	}

	if (maskPattern < -1 || maskPattern > 7) throw new RangeError('Mask value out of range');

	const segments = makeSegments(value);

	let level: EccLevel = ECC_LEVELS[ecc] ?? ECC_LEVELS.L;
	let version: number;
	let usedBits = 0;

	for (version = minVersion; ; version++) {
		const capacity = dataCodewords(version, level) * 8;

		usedBits = totalBits(segments, version);

		if (usedBits <= capacity) break;
		if (version >= maxVersion) throw new RangeError('Data too long');
	}

	if (boostEcc) {
		for (const candidate of [ECC_LEVELS.M, ECC_LEVELS.Q, ECC_LEVELS.H]) {
			if (usedBits <= dataCodewords(version, candidate) * 8) level = candidate;
		}
	}

	const symbol = buildSymbol(segments, level, version, maskPattern);
	const moduleCount = symbol.size;
	const withBorder = border > 0 ? moduleCount + border * 2 : moduleCount;
	const data = Array.from({ length: withBorder }, (_, row) =>
		Array.from({ length: withBorder }, (_, col) => {
			const sourceRow = row - border;
			const sourceCol = col - border;

			if (sourceRow < 0 || sourceRow >= moduleCount) return false;
			if (sourceCol < 0 || sourceCol >= moduleCount) return false;

			return symbol.modules[sourceRow][sourceCol];
		})
	);

	return {
		size: withBorder,
		data,
		version,
		maskPattern: symbol.mask,
		ecc: (Object.keys(ECC_LEVELS).find((key) => ECC_LEVELS[key as QrCodeEcc] === level) ??
			'L') as QrCodeEcc
	};
}

/** Serialize the dark modules of a matrix into a single SVG path. */
export function qrPatternPath(matrix: QrMatrix, pixelSize: number): string {
	const paths: string[] = [];

	for (let row = 0; row < matrix.size; row++) {
		for (let col = 0; col < matrix.size; col++) {
			if (!matrix.data[row][col]) continue;

			const x = col * pixelSize;
			const y = row * pixelSize;

			paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`);
		}
	}

	return paths.join('');
}
