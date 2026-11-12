/** HTML <meter> region selection, used to pick a tone. */

export type MeterRegion = 'optimum' | 'suboptimum' | 'even-less-good';

export interface MeterBounds {
	value: number;
	min: number;
	max: number;
	low?: number;
	high?: number;
	optimum?: number;
}

export interface MeterScale {
	value: number;
	min: number;
	max: number;
	low: number;
	high: number;
	optimum: number;
	/** 0–1 fraction of the range, for `--value`. */
	fraction: number;
	region: MeterRegion;
}

function finite(n: number, fallback: number): number {
	return Number.isFinite(n) ? n : fallback;
}

/** Clamp the bounds the way a user agent does for `<meter>`, then name the region. */
export function meterScale(input: MeterBounds): MeterScale {
	const min = finite(input.min, 0);
	let max = finite(input.max, 100);
	if (max < min) max = min;
	const value = Math.min(max, Math.max(min, finite(input.value, min)));
	let low = finite(input.low ?? min, min);
	low = Math.min(max, Math.max(min, low));
	let high = finite(input.high ?? max, max);
	if (high < low) high = low;
	high = Math.min(max, Math.max(min, high));
	let optimum = finite(input.optimum ?? (min + max) / 2, (min + max) / 2);
	optimum = Math.min(max, Math.max(min, optimum));

	let region: MeterRegion;
	if (optimum < low) {
		if (value <= low) region = 'optimum';
		else if (value <= high) region = 'suboptimum';
		else region = 'even-less-good';
	} else if (optimum > high) {
		if (value >= high) region = 'optimum';
		else if (value >= low) region = 'suboptimum';
		else region = 'even-less-good';
	} else if (value >= low && value <= high) {
		region = 'optimum';
	} else {
		region = 'suboptimum';
	}

	const span = max - min;
	const fraction = span <= 0 ? 0 : (value - min) / span;
	return { value, min, max, low, high, optimum, fraction, region };
}
