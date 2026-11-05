// Svelte 5 Rune-based state
export class CameraState {
	x = $state(0);
	y = $state(0);
	zoom = $state(1);

	minZoom = 0.05;
	maxZoom = 3;

	pan(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}

	/**
	 * Zoom around a point (vx, vy) in viewport-local coordinates.
	 */
	zoomAt(factor: number, vx: number, vy: number) {
		const newZoom = Math.min(Math.max(this.zoom * factor, this.minZoom), this.maxZoom);
		this.x = vx - (vx - this.x) * (newZoom / this.zoom);
		this.y = vy - (vy - this.y) * (newZoom / this.zoom);
		this.zoom = newZoom;
	}

	/**
	 * Step zoom in/out centered on the viewport.
	 */
	zoomStep(delta: number, viewport?: HTMLElement | null) {
		const vx = viewport ? viewport.clientWidth / 2 : window.innerWidth / 2;
		const vy = viewport ? viewport.clientHeight / 2 : window.innerHeight / 2;
		const target = Math.min(Math.max(Number((this.zoom + delta).toFixed(2)), this.minZoom), this.maxZoom);
		this.x = vx - (vx - this.x) * (target / this.zoom);
		this.y = vy - (vy - this.y) * (target / this.zoom);
		this.zoom = target;
	}

	/**
	 * Set exact zoom level centered on the viewport.
	 */
	zoomTo(targetZoom: number, viewport?: HTMLElement | null) {
		const vx = viewport ? viewport.clientWidth / 2 : window.innerWidth / 2;
		const vy = viewport ? viewport.clientHeight / 2 : window.innerHeight / 2;
		const clamped = Math.min(Math.max(targetZoom, this.minZoom), this.maxZoom);
		this.x = vx - (vx - this.x) * (clamped / this.zoom);
		this.y = vy - (vy - this.y) * (clamped / this.zoom);
		this.zoom = clamped;
	}

	reset() {
		this.x = 0;
		this.y = 0;
		this.zoom = 1;
	}

	fitToView(viewport?: HTMLElement | null, plane?: HTMLElement | null, padding = 40) {
		if (!viewport || !plane) return;
		const vw = viewport.clientWidth;
		const vh = viewport.clientHeight;
		if (!vw || !vh) return;

		// Measure the bounding box of all children in plane coordinates
		const children = Array.from(plane.children) as HTMLElement[];
		if (children.length === 0) return;

		const planeRect = plane.getBoundingClientRect();
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (const child of children) {
			const r = child.getBoundingClientRect();
			const cx1 = (r.left - planeRect.left) / this.zoom;
			const cy1 = (r.top - planeRect.top) / this.zoom;
			const cx2 = (r.right - planeRect.left) / this.zoom;
			const cy2 = (r.bottom - planeRect.top) / this.zoom;
			if (cx1 < minX) minX = cx1;
			if (cy1 < minY) minY = cy1;
			if (cx2 > maxX) maxX = cx2;
			if (cy2 > maxY) maxY = cy2;
		}

		const contentW = maxX - minX;
		const contentH = maxY - minY;
		if (contentW <= 0 || contentH <= 0) return;

		const scaleX = (vw - padding * 2) / contentW;
		const scaleY = (vh - padding * 2) / contentH;
		const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY, 1), this.minZoom), this.maxZoom);

		this.zoom = newZoom;
		this.x = Math.round((vw - contentW * newZoom) / 2 - minX * newZoom);
		this.y = Math.round((vh - contentH * newZoom) / 2 - minY * newZoom);
	}
}

export const camera = new CameraState();
