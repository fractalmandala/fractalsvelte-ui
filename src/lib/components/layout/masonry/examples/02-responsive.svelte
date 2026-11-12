<!-- @example Responsive columns :: A column map that follows the element's width. -->
<script lang="ts">
	import { Masonry } from '@fractaldesign/fractalsvelte-ui';

	const shots = [
		{ title: 'Lobby', caption: 'The foyer at first light, looking toward the courtyard.' },
		{ title: 'Workshop', caption: 'Benches cleared for the Friday review.' },
		{ title: 'Archive', caption: 'Boxes from the 2019 identity work, still labelled in pencil.' },
		{ title: 'Garden', caption: 'Rain on the north wall, an hour after the shoot.' },
		{ title: 'Stair', caption: 'The concrete flight up to the mezzanine studio.' },
		{ title: 'Desk', caption: 'A proof of the new letterhead, taped beside the lamp.' }
	];
</script>

<Masonry columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 4 }} gap="var(--space-sm)" items={shots}>
	{#snippet children(shot)}
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel">
			<span class="text-sm weight-500">{shot.title}</span>
			<span class="text-sm text-muted">{shot.caption}</span>
		</div>
	{/snippet}
</Masonry>
