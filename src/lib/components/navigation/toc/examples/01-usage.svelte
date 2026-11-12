<!-- @example Usage :: A short essay with a table of contents that tracks the heading in view. -->
<script lang="ts">
	import { Toc } from '@fractaldesign/fractalsvelte-ui';

	let active = $state<string | null>('harbour');
	const items = [
		{ id: 'harbour', label: 'The harbour', level: 2 },
		{ id: 'lights', label: 'Leading lights', level: 3 },
		{ id: 'charts', label: 'The charts', level: 2 },
		{ id: 'revisions', label: 'Revisions', level: 3 },
		{ id: 'colophon', label: 'Colophon', level: 4 }
	];
</script>

<div class="row gap-xl ytop">
	<div id="atlas-essay" class="scroll-y max-h grow pad-bs box gap-lg">
		<section class="box gap-sm">
			<h2 id="harbour" class="page-heading-bs">The harbour</h2>
			<p class="text-body text-secondary">
				Tórshavn's inner harbour is still worked by the coastal boats, though most of the fish now
				lands further west. The stone quays were relaid in 1963, and the same granite still takes
				the mooring lines.
			</p>
			<p class="text-body text-secondary">
				On a spring tide the water climbs the lower steps and leaves the ramps dark for the rest of
				the morning.
			</p>
			<h3 id="lights" class="page-heading-bs">Leading lights</h3>
			<p class="text-body text-secondary">
				Two lights on the west breakwater give the line in: a fixed white, and a quicker flash
				above it. Keep them stacked until the inner wall opens to starboard.
			</p>
		</section>
		<section class="box gap-sm">
			<h2 id="charts" class="page-heading-bs">The charts</h2>
			<p class="text-body text-secondary">
				The desk redraws the harbour plan every March, after the winter storms have had their say
				in the sounding. Corrections arrive as a short leaflet, folded into the atlas.
			</p>
			<h3 id="revisions" class="page-heading-bs">Revisions</h3>
			<p class="text-body text-secondary">
				Last year's revision moved the ferry berth twenty metres east and marked a new wreck on
				the inner shoal, uncovers at low water.
			</p>
			<h4 id="colophon" class="page-heading-bs">Colophon</h4>
			<p class="text-body text-secondary">
				Printed in two colours on an uncoated stock, bound at Harbour Bindery, and issued in a
				run of six hundred.
			</p>
		</section>
	</div>
	<div class="shrink-0">
		<Toc {items} bind:active onActiveChange={() => {}} label="On this page" />
	</div>
</div>
