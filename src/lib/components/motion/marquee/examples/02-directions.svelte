<!-- @example Directions :: Left, right, up and down — vertical strips need a height. -->
<script lang="ts">
	import { Marquee } from '@fractaldesign/fractalsvelte-ui';

	const headlines = [
		'Deploys are healthy across eu-west-1',
		'Invoice INV-2048 is due 18 Nov',
		'The autumn catalogue is live',
		"Two seats left on Friday's tasting"
	];
</script>

<div class="box gap-lg">
	{#each ['left', 'right'] as const as direction (direction)}
		<div class="box gap-xs">
			<p class="text-xs text-muted">direction: {direction}</p>
			<Marquee {direction} speed={36} aria-label={`Headlines travelling ${direction}`}>
				{#each headlines as line (line)}
					<span class="text-sm text-secondary">{line}</span>
				{/each}
			</Marquee>
		</div>
	{/each}
	<div class="row gap-md">
		{#each ['up', 'down'] as const as direction (direction)}
			<div class="box gap-xs grow">
				<p class="text-xs text-muted">direction: {direction}</p>
				<div class="h-2xl overflow-hidden">
					<Marquee {direction} speed={28} class="hfull" aria-label={`Notices travelling ${direction}`}>
						{#each headlines as line (line)}
							<span class="text-sm text-secondary">{line}</span>
						{/each}
					</Marquee>
				</div>
			</div>
		{/each}
	</div>
</div>
