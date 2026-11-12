/**
 * fsui-unify: springs moved
 *
 * Spring tokens now live in @fractaldesign/fractalstyler (src/lib/styles/springs.css)
 * and are regenerated with `npm run gen:springs` in that package. This hook is
 * kept so `pnpm gen` still has a springs step; it no longer writes a local sheet.
 */
export function generateSprings(): string {
	return '';
}

export async function run(): Promise<void> {
	// Intentionally empty: tokens are generated in fractalstyler.
}

const invoked = false;
if (invoked) {
	await run();
}
