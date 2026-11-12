<!-- @example Vertical :: A side dock for a listening app, with labels to the right. -->
<script lang="ts">
	import { Dock } from '@fractaldesign/fractalsvelte-ui';
	import { luDisc, luPodcast, luRadio, luHeart, luSearch } from '@fractaldesign/icons/lucide';
</script>

<div class="row pl-2xl">
	<Dock
		orientation="vertical"
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
