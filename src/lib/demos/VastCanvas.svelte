<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		// 1. Feature detection
		if (!navigator.gpu) {
			console.error('WebGPU is not supported on this browser or platform.');
			return;
		}

		let device: GPUDevice;
		let context: GPUCanvasContext;
		let presentationFormat: GPUTextureFormat;

		async function initWebGPU() {
			const adapter = await navigator.gpu.requestAdapter({
				powerPreference: 'high-performance'
			});

			if (!adapter) {
				console.error('No suitable GPU adapter found.');
				return;
			}

			device = await adapter.requestDevice();

			const ctx = canvas.getContext('webgpu') as GPUCanvasContext | null;
			if (!ctx) {
				console.error('Failed to get WebGPU context.');
				return;
			}
			context = ctx;

			presentationFormat = navigator.gpu.getPreferredCanvasFormat();

			// Resize canvas buffer to match screen size and DPI
			resize();

			// First draw
			render();
		}

		function resize() {
			if (!canvas || !device || !context) return;

			// Handle High-DPI screens without blurriness
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const width = Math.floor(window.innerWidth * dpr);
			const height = Math.floor(window.innerHeight * dpr);

			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;

				context.configure({
					device,
					format: presentationFormat,
					alphaMode: 'premultiplied'
				});
				render();
			}
		}

		function render() {
			if (!device || !context) return;

			// Static: clear to transparent so the canvas's CSS background (var(--bg)) shows,
			// which also follows light/dark mode. Draw once; redraw only on resize.
			const commandEncoder = device.createCommandEncoder();
			const textureView = context.getCurrentTexture().createView();

			const renderPass = commandEncoder.beginRenderPass({
				colorAttachments: [
					{
						view: textureView,
						clearValue: { r: 0, g: 0, b: 0, a: 0 },
						loadOp: 'clear',
						storeOp: 'store'
					}
				]
			});

			// Draw passes / pipelines go here
			renderPass.end();

			device.queue.submit([commandEncoder.finish()]);
		}

		initWebGPU();

		window.addEventListener('resize', resize);

		return () => {
			window.removeEventListener('resize', resize);
			if (device) {
				device.destroy();
			}
		};
	});
</script>

<canvas bind:this={canvas} class="vast-canvas"></canvas>

<style>

	.vast-canvas {
		display: block;
		width: 100vw;
		height: calc(100vh - var(--header-height));
		position: fixed;
		top: 64px;
		left: 0;
		z-index: 0;
		background: var(--bg);
	}
</style>