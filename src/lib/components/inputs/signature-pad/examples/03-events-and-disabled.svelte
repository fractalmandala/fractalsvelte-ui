<!-- @example Events and disabled :: onPathsChange counts each stroke, onEnd hands back a PNG, and disabled locks the pad. -->
<script lang="ts">
	import { SignaturePad } from '@fractaldesign/fractalsvelte-ui';

	let paths = $state<string[]>([]);
	let strokes = $state(0);
	let saved = $state('');
</script>

<div class="box gap-sm measure-sm">
	<SignaturePad
		bind:paths
		label="Damage report signature"
		onPathsChange={(next) => (strokes = next.length)}
		onEnd={(url) => (saved = url ? `${Math.round(url.length / 1024)} KB PNG ready` : 'Cleared')}
	/>
	<SignaturePad label="Renter signature, locked until inspection" shape="modern" disabled />
	<p class="text-sm text-secondary tabular-nums">{strokes} strokes · {saved || 'nothing captured yet'}</p>
</div>
