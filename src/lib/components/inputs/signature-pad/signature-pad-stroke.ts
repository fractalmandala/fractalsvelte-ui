export interface SignaturePadPoint {
	x: number;
	y: number;
	pressure?: number | null;
}

export interface SignatureStrokeOptions {
	size?: number;
	thinning?: number;
	simulatePressure?: boolean;
}

export type StrokePoint = [number, number];

const average = (a: number, b: number): number => (a + b) / 2;
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

function pressureAt(
	point: SignaturePadPoint,
	previous: SignaturePadPoint | undefined,
	simulate: boolean
): number {
	if (point.pressure != null && point.pressure !== 0) return clamp(point.pressure, 0, 1);
	if (!simulate || !previous) return 0.5;

	const distance = Math.hypot(point.x - previous.x, point.y - previous.y);

	return clamp(1 - distance / 40, 0.15, 1);
}

export function getStroke(
	points: readonly SignaturePadPoint[],
	options: SignatureStrokeOptions = {}
): StrokePoint[] {
	if (points.length < 2) return [];

	const size = options.size ?? 2;
	const thinning = options.thinning ?? 0.5;
	const simulate = options.simulatePressure ?? true;
	const left: StrokePoint[] = [];
	const right: StrokePoint[] = [];

	for (let index = 0; index < points.length; index++) {
		const point = points[index];
		const before = points[index - 1] ?? point;
		const after = points[index + 1] ?? point;
		const deltaX = after.x - before.x;
		const deltaY = after.y - before.y;
		const length = Math.hypot(deltaX, deltaY) || 1;
		const pressure = pressureAt(point, points[index - 1], simulate);
		const radius = Math.max((size / 2) * (1 - thinning * (1 - pressure)), 0.01);
		const normalX = (-deltaY / length) * radius;
		const normalY = (deltaX / length) * radius;

		left.push([point.x + normalX, point.y + normalY]);
		right.push([point.x - normalX, point.y - normalY]);
	}

	return left.concat(right.reverse());
}

export function getSvgPathFromStroke(points: readonly StrokePoint[], closed = true): string {
	const len = points.length;
	if (len < 4) return '';

	let a = points[0];
	let b = points[1];
	const c = points[2];
	let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

	for (let i = 2, max = len - 1; i < max; i++) {
		a = points[i];
		b = points[i + 1];
		result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
	}

	if (closed) result += 'Z';

	return result;
}
