<!-- @example Formats :: Switch the CSS notation between hex, rgb and oklch; the same colour is rewritten in the chosen format. -->
<script lang="ts">
	import { ColorPicker, type ColorFormat } from '@fractaldesign/fractalsvelte-ui';

	let colour = $state('oklch(0.623 0.188 259.8)');
	let format = $state<ColorFormat>('oklch');
	const formats: ColorFormat[] = ['hex', 'rgb', 'oklch'];
</script>

<div class="box gap-sm">
	<div class="row wrap gap-xs">
		{#each formats as item (item)}
			<button
				type="button"
				class={['button h-bs text-sm modern', format === item ? 'secondary' : 'ghost']}
				onclick={() => (format = item)}
			>
				{item}
			</button>
		{/each}
	</div>
	<ColorPicker bind:value={colour} {format} label="Accent" onValueChange={(v) => console.info('colour', v)} />
	<p class="text-sm text-muted font-mono">{colour}</p>
</div>
