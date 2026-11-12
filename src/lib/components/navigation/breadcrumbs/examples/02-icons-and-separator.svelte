<!-- @example Icons and separator :: A leading icon on each crumb, and a slash in place of the chevron. -->
<script lang="ts">
	import { Breadcrumbs } from '@fractaldesign/fractalsvelte-ui';
	import { luHouse, luCamera, luAperture, luSlash } from '@fractaldesign/icons/lucide';
</script>

<Breadcrumbs
	separator={luSlash}
	items={[
		{ label: 'Studio', href: '/studio', icon: luHouse },
		{ label: 'Sittings', href: '/studio/sittings', icon: luCamera },
		{ label: 'Plate 47', icon: luAperture }
	]}
/>
