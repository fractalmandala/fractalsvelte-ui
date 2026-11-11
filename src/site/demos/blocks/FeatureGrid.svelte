<script lang="ts">
	import { FeatureGrid } from '@fractaldesign/fractalsvelte-ui';
	import { klAccessibility, klPalette, klZap } from '@fractaldesign/fractalsvelte-ui/icons/keylinestroke';

	const items = [
		{ title: 'Fast', description: 'Built on Svelte 5.', icon: klZap },
		{ title: 'Accessible', description: 'Keyboard and screen reader friendly.', icon: klAccessibility },
		{ title: 'Themeable', description: 'Light and dark modes.', icon: klPalette }
	];
</script>

<FeatureGrid {items} />
