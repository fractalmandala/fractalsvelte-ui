// Svelte 5 Rune-based state
export class CameraState {
	x = $state(0);
	y = $state(0);
	zoom = $state(1);

	pan(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}

	zoomAt(factor: number, clientX: number, clientY: number) {
		const newZoom = Math.min(Math.max(this.zoom * factor, 0.2), 3);
		// Zoom toward cursor
		this.x = clientX - (clientX - this.x) * (newZoom / this.zoom);
		this.y = clientY - (clientY - this.y) * (newZoom / this.zoom);
		this.zoom = newZoom;
	}
}

export const camera = new CameraState();