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

export function hueFromName(name: string): number {
	let hash = 0;
	for (const ch of name) {
		hash = (Math.imul(hash, 33) + (ch.codePointAt(0) ?? 0)) >>> 0;
	}
	return hash % 360;
}

