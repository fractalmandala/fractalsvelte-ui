/** Initials and a deterministic hue derived from a name. */

/** One or two letters taken from a person's name, for the fallback glyph. */
export function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '';
	if (parts.length === 1) {
		const chars = Array.from(parts[0]);
		return chars.slice(0, 2).join('').toUpperCase();
	}
	const first = Array.from(parts[0])[0] ?? '';
	const last = Array.from(parts[parts.length - 1])[0] ?? '';
	return (first + last).toUpperCase();
}

/** A hue in 0..359, stable for a given name, written to `--avatar-hue`. */
export function hueFromName(name: string): number {
	let hash = 0;
	for (const ch of name) {
		hash = (Math.imul(hash, 33) + (ch.codePointAt(0) ?? 0)) >>> 0;
	}
	return hash % 360;
}

/** The avatar size class that sets `--avatar-size`. */
export const avatarSizeClass = {
	xs: 'avatar-xs',
	sm: 'avatar-sm',
	md: 'avatar-md',
	lg: 'avatar-lg',
	xl: 'avatar-xl'
} as const;
