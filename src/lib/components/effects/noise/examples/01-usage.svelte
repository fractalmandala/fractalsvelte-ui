<!-- @example Usage :: A quiet grain over a dark photograph card. -->
<script lang="ts">
	import { Noise } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="relative overflow-hidden curved measure-sm bg-panel">
	<img
		class="wfull"
		src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=70"
		alt="Sunlight through a pine forest in the hills"
	/>
	<Noise />
	<div class="pin-bl box gap-xs">
		<p class="text-sm text-white">Field notes</p>
		<p class="card-title text-white">Morning on the ridge</p>
	</div>
</div>
