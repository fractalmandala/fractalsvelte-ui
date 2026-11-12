<!-- @example Speed, gap and repeat :: Every step of the space ladder, a slower pace, and more copies of a short strip. -->
<script lang="ts">
	import { Marquee } from '@fractaldesign/fractalsvelte-ui';

	const gaps = ['xs', 'sm', 'md', 'bs', 'lg', 'xl', '2xl', '3xl'] as const;
</script>

<div class="box gap-md">
	<Marquee speed={24} gap="xl" repeat={4} aria-label="A short phrase, tiled four times">
		<span class="text-sm weight-500">fractalsvelte-ui</span>
		<span class="text-sm text-muted">the spring library</span>
	</Marquee>
	<div class="box gap-sm">
		{#each gaps as gap (gap)}
			<Marquee {gap} speed={40} aria-label={`Partners with a ${gap} gap`}>
				<span class="text-xs text-muted">{gap}</span>
				<span class="tag">Northwind</span>
				<span class="tag">Fjord Line</span>
				<span class="tag">Harbor &amp; Co.</span>
			</Marquee>
		{/each}
	</div>
</div>
