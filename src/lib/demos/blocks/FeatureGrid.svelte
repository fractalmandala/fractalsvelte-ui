<script lang="ts">
	import { FeatureGrid } from '$lib/styler';
	import { luZap, luAccessibility, luPalette } from '@fractaldesign/icons/lucide';

	const items = [
		{ title: 'Fast', description: 'Built on Svelte 5.', icon: luZap },
		{ title: 'Accessible', description: 'Keyboard and screen reader friendly.', icon: luAccessibility },
		{ title: 'Themeable', description: 'Light and dark modes.', icon: luPalette }
	];
</script>

<FeatureGrid {items} />
