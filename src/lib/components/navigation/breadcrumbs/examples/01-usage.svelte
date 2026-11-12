<!-- @example Usage :: A short trail from the catalogue to the current essay. -->
<script lang="ts">
	import { Breadcrumbs } from '@fractaldesign/fractalsvelte-ui';
</script>

<Breadcrumbs
	label="Breadcrumb"
	items={[
		{ label: 'Catalogue', href: '/catalogue' },
		{ label: 'Essays', href: '/catalogue/essays' },
		{ label: 'On keeping a tide book' }
	]}
/>
