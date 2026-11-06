<script lang="ts">
	import Canvas from '$lib/components/blocks/Canvas.svelte';

	function draw(ctx: CanvasRenderingContext2D, size: { width: number; height: number }) {
		ctx.clearRect(0, 0, size.width, size.height);
		ctx.fillStyle = '#22c55e';
		ctx.beginPath();
		ctx.arc(size.width / 2, size.height / 2, Math.min(size.width, size.height) / 4, 0, Math.PI * 2);
		ctx.fill();
	}
</script>

<Canvas {draw} ratio="16 / 9" label="Interactive drawing canvas" />
