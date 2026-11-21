<!-- @example Error correction levels :: The same ticket link encoded at L, M and Q recovery, with a wider quiet zone, curved corners and the symbol aligned to the start. -->
<script lang="ts">
	import { QrCode } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	{#each ['L', 'M', 'Q'] as const as ecc (ecc)}
		<div class="column xcenter gap-xs">
			<QrCode
				value="https://fractaldesign.dev/events/frontier-2026"
				{ecc}
				pixelSize={3}
				quietZone={4}
				shape="curved"
				surface="outlined"
				alignContent="xleft"
				overlaySurface="paneled"
				textSize="text-sm"
				textColor="text-warning"
				label={`Frontier 2026 ticket, ${ecc} error correction`}
			/>
			<span class="text-xs text-muted">ECC {ecc}</span>
		</div>
	{/each}
</div>
