/** Colour conversion for the colour picker. Internal model is HSV + alpha; output is a CSS colour string. */

export type ColorFormat = 'hex' | 'rgb' | 'oklch';

export interface Hsv {
	/** Hue, 0–360. */
	h: number;
	/** Saturation, 0–1. */
	s: number;
	/** Value (brightness), 0–1. */
	v: number;
	/** Alpha, 0–1. */
	a: number;
}

const clamp = (n: number, min = 0, max = 1): number => Math.min(max, Math.max(min, n));

export function hsvToRgb(hsv: Hsv): { r: number; g: number; b: number; a: number } {
	const h = ((hsv.h % 360) + 360) % 360;
	const s = clamp(hsv.s);
	const v = clamp(hsv.v);
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let r = 0, g = 0, b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a: clamp(hsv.a) };
}

export function rgbToHsv(r: number, g: number, b: number, a = 1): Hsv {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;
	let h = 0;
	if (d !== 0) {
		if (max === r) h = ((g - b) / d) % 6;
		else if (max === g) h = (b - r) / d + 2;
		else h = (r - g) / d + 4;
		h *= 60;
		if (h < 0) h += 360;
	}
	return { h, s: max === 0 ? 0 : d / max, v: max, a: clamp(a) };
}

function lin(c: number): number {
	const s = clamp(c / 255);
	return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function gam(c: number): number {
	const g = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;
	return clamp(g) * 255;
}

function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
	const lr = lin(r), lg = lin(g), lb = lin(b);
	const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
	const l = Math.cbrt(l_);
	const m = Math.cbrt(m_);
	const s = Math.cbrt(s_);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	const C = Math.hypot(a, b2);
	let h = (Math.atan2(b2, a) * 180) / Math.PI;
	if (h < 0) h += 360;
	return { l: L, c: C, h: C < 1e-8 ? 0 : h };
}

function oklchToRgb(L: number, C: number, H: number): { r: number; g: number; b: number } {
	const a = C * Math.cos((H * Math.PI) / 180);
	const b = C * Math.sin((H * Math.PI) / 180);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ * l_ * l_;
	const m = m_ * m_ * m_;
	const s = s_ * s_ * s_;
	const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
	const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
	const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
	return { r: gam(lr), g: gam(lg), b: gam(lb) };
}

function hexByte(n: number): string {
	return Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0');
}

function fmt(n: number, digits = 3): string {
	const r = Number(n.toFixed(digits));
	return String(Object.is(r, -0) ? 0 : r);
}

/** Format HSV as a CSS colour string in `format`. */
export function formatColor(hsv: Hsv, format: ColorFormat): string {
	const { r, g, b, a } = hsvToRgb(hsv);
	const alpha = a < 1 - 1e-6;
	if (format === 'hex') {
		const body = `#${hexByte(r)}${hexByte(g)}${hexByte(b)}`;
		return alpha ? `${body}${hexByte(a * 255)}` : body;
	}
	if (format === 'rgb') {
		const rgb = `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
		return alpha ? `rgb(${rgb} / ${fmt(a, 3)})` : `rgb(${rgb})`;
	}
	const { l, c, h } = rgbToOklch(r, g, b);
	const core = `${fmt(l, 3)} ${fmt(c, 3)} ${fmt(h, 1)}`;
	return alpha ? `oklch(${core} / ${fmt(a, 3)})` : `oklch(${core})`;
}

/** Opaque CSS colour of the same hue, saturation and value — used for the alpha slider's solid end. */
export function formatSolid(hsv: Hsv, format: ColorFormat = 'hex'): string {
	return formatColor({ ...hsv, a: 1 }, format);
}

function parseHex(raw: string): Hsv | null {
	const h = raw.replace(/^#/, '');
	if (!/^[0-9a-fA-F]+$/.test(h)) return null;
	let r: number, g: number, b: number, a = 1;
	if (h.length === 3 || h.length === 4) {
		r = parseInt(h[0] + h[0], 16);
		g = parseInt(h[1] + h[1], 16);
		b = parseInt(h[2] + h[2], 16);
		if (h.length === 4) a = parseInt(h[3] + h[3], 16) / 255;
	} else if (h.length === 6 || h.length === 8) {
		r = parseInt(h.slice(0, 2), 16);
		g = parseInt(h.slice(2, 4), 16);
		b = parseInt(h.slice(4, 6), 16);
		if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
	} else return null;
	return rgbToHsv(r, g, b, a);
}

function parseFn(text: string): Hsv | null {
	const m = text.trim().match(/^([a-z]+)\(\s*([\s\S]+)\)\s*$/i);
	if (!m) return null;
	const name = m[1].toLowerCase();
	let body = m[2].trim();
	let a = 1;
	const slash = body.split('/');
	if (slash.length === 2) {
		body = slash[0].trim();
		const av = parseAlpha(slash[1].trim());
		if (av === null) return null;
		a = av;
	}
	const parts = body.split(/[\s,]+/).filter(Boolean);
	if (name === 'rgb' || name === 'rgba') {
		if (name === 'rgba' && parts.length === 4 && slash.length === 1) {
			const av = parseAlpha(parts.pop() as string);
			if (av === null) return null;
			a = av;
		}
		if (parts.length !== 3) return null;
		const nums = parts.map((p, i) => parseChannel(p, i < 3));
		if (nums.some((n) => n === null)) return null;
		return rgbToHsv(nums[0] as number, nums[1] as number, nums[2] as number, a);
	}
	if (name === 'hsl' || name === 'hsla') {
		if (name === 'hsla' && parts.length === 4 && slash.length === 1) {
			const av = parseAlpha(parts.pop() as string);
			if (av === null) return null;
			a = av;
		}
		if (parts.length !== 3) return null;
		const h = parseHue(parts[0]);
		const s = parsePercent(parts[1]);
		const l = parsePercent(parts[2]);
		if (h === null || s === null || l === null) return null;
		return { ...hslToHsv(h, s, l), a };
	}
	if (name === 'oklch') {
		if (parts.length !== 3) return null;
		const L = parseOklchL(parts[0]);
		const c = Number(parts[1]);
		const h = parseHue(parts[2]);
		if (L === null || !Number.isFinite(c) || h === null) return null;
		const rgb = oklchToRgb(L, c, h);
		return rgbToHsv(rgb.r, rgb.g, rgb.b, a);
	}
	return null;
}

function parseChannel(p: string, rgb: boolean): number | null {
	if (p.endsWith('%')) {
		const n = Number(p.slice(0, -1));
		if (!Number.isFinite(n)) return null;
		return clamp(n / 100) * 255;
	}
	const n = Number(p);
	if (!Number.isFinite(n)) return null;
	return rgb ? clamp(n, 0, 255) : n;
}

function parseAlpha(p: string): number | null {
	if (p.endsWith('%')) {
		const n = Number(p.slice(0, -1));
		return Number.isFinite(n) ? clamp(n / 100) : null;
	}
	const n = Number(p);
	return Number.isFinite(n) ? clamp(n) : null;
}

function parsePercent(p: string): number | null {
	const n = Number(p.endsWith('%') ? p.slice(0, -1) : p);
	if (!Number.isFinite(n)) return null;
	return clamp(p.endsWith('%') || n > 1 ? n / 100 : n);
}

function parseOklchL(p: string): number | null {
	if (p.endsWith('%')) {
		const n = Number(p.slice(0, -1));
		return Number.isFinite(n) ? clamp(n / 100) : null;
	}
	const n = Number(p);
	return Number.isFinite(n) ? clamp(n) : null;
}

function parseHue(p: string): number | null {
	const n = Number(p.replace(/deg$/i, ''));
	return Number.isFinite(n) ? n : null;
}

function hslToHsv(h: number, s: number, l: number): Hsv {
	const v = l + s * Math.min(l, 1 - l);
	const sv = v === 0 ? 0 : 2 * (1 - l / v);
	return { h: ((h % 360) + 360) % 360, s: sv, v, a: 1 };
}

/** Parse a CSS colour string (hex, rgb, rgba, hsl, oklch) into HSV, or `null` if it is not recognised. */
export function parseColor(input: string): Hsv | null {
	const text = input.trim();
	if (!text) return null;
	if (text === 'transparent') return { h: 0, s: 0, v: 0, a: 0 };
	if (text.startsWith('#')) return parseHex(text);
	if (/^[0-9a-fA-F]{3,8}$/.test(text)) return parseHex(text);
	return parseFn(text);
}

export function equalHsv(a: Hsv, b: Hsv): boolean {
	return (
		Math.abs(a.h - b.h) < 0.05 &&
		Math.abs(a.s - b.s) < 0.001 &&
		Math.abs(a.v - b.v) < 0.001 &&
		Math.abs(a.a - b.a) < 0.001
	);
}
