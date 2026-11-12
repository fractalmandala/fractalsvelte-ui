<!-- @example Collapsed trail :: A long path collapses behind an ellipsis when it is longer than maxItems. -->
<script lang="ts">
	import { Breadcrumbs } from '@fractaldesign/fractalsvelte-ui';
	import { luHouse } from '@fractaldesign/icons/lucide';
</script>

<Breadcrumbs
	maxItems={4}
	items={[
		{ label: 'Atlas', href: '/', icon: luHouse },
		{ label: 'North Atlantic', href: '/north-atlantic' },
		{ label: 'Coasts', href: '/north-atlantic/coasts' },
		{ label: 'Faroe Islands', href: '/north-atlantic/coasts/faroe' },
		{ label: 'Streymoy', href: '/north-atlantic/coasts/faroe/streymoy' },
		{ label: 'Tórshavn' }
	]}
/>
