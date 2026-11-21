<!-- @example Block and full bleed :: A band that pulls both its block margins out of the card padding, and a full-bleed strip that runs to both viewport edges. -->
<script lang="ts">
	import { Bleed, Card, CardContent, CardTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<Card class="measure-sm">
	<CardTitle>Deploy log</CardTitle>
	<CardContent>Build 4812 finished in 2m 14s, up from 2m 06s.</CardContent>
	<Bleed inline="sm" block="md">
		<div class="bg-panel bt bb pad-md text-sm text-secondary">
			Rolled back to build 4811 after the health check on /api/health timed out.
		</div>
	</Bleed>
	<CardContent>Nothing else changed in this release.</CardContent>
</Card>

<div class="overflow-hidden border modern mt-lg">
	<Bleed full>
		<div class="bg-panel pad-md text-sm text-secondary tt-c">
			Full bleed spans the viewport, not the column it sits in.
		</div>
	</Bleed>
</div>
