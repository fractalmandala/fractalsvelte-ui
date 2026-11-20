<!-- @example Usage :: Scannable QR code with URL and centered icon overlay. -->
<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luSparkles } from '@fractaldesign/icons/lucide';
	import { QrCode } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<QrCode value="https://fractaldesign.dev" label="Visit Fractal Design" />
	<QrCode value="https://fractaldesign.dev/docs" ecc="H" pixelSize={4} label="Documentation link">
		{#snippet overlay()}
			<Icon icon={luSparkles} class="text-theme" />
		{/snippet}
	</QrCode>
</div>
