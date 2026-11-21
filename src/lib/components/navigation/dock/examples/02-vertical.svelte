<!-- @example Vertical :: A side dock for a listening app, with a tighter inset, a wider gap and items aligned to the start edge. -->
<script lang="ts">
	import { Dock } from '@fractaldesign/fractalsvelte-ui';
	import { luDisc, luPodcast, luRadio, luHeart, luSearch } from '@fractaldesign/icons/lucide';
</script>

<div class="row pl-2xl">
	<Dock
		orientation="vertical"
		surface="paneled"
		shape="curved"
		pad="pad-md"
		gap="gap-md"
		alignContent="xleft"
		current="records"
		items={[
			{ value: 'search', label: 'Search', icon: luSearch, href: '/search' },
			{ value: 'records', label: 'Records', icon: luDisc, href: '/records' },
			{ value: 'shows', label: 'Shows', icon: luPodcast, href: '/shows' },
			{ value: 'live', label: 'Live', icon: luRadio, href: '/live' },
			{ value: 'loved', label: 'Loved', icon: luHeart, href: '/loved' }
		]}
	/>
</div>
