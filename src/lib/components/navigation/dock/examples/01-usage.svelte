<!-- @example Usage :: A horizontal dock of studio tools, with labels on hover. -->
<script lang="ts">
	import { Dock } from '@fractaldesign/fractalsvelte-ui';
	import { luCamera, luAperture, luImage, luSettings, luFolder } from '@fractaldesign/icons/lucide';

	let current = $state('expose');
</script>

<div class="row xcenter pt-2xl">
	<Dock
		label="Dock"
		orientation="horizontal"
		current={current}
		items={[
			{ value: 'library', label: 'Library', icon: luFolder, href: '/library' },
			{ value: 'expose', label: 'Expose', icon: luCamera, onSelect: () => (current = 'expose') },
			{ value: 'aperture', label: 'Aperture', icon: luAperture, onSelect: () => (current = 'aperture') },
			{ value: 'review', label: 'Review', icon: luImage, onSelect: () => (current = 'review') },
			{ value: 'settings', label: 'Settings', icon: luSettings, disabled: true }
		]}
	/>
</div>
