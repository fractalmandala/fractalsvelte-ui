<!-- @example Usage :: Media banner breaking horizontally to the edges of a padded card. -->
<script lang="ts">
	import { Bleed, Card, CardContent, CardTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<Card class="measure-sm">
	<CardTitle>Release highlights</CardTitle>
	<Bleed inline="gap-bs">
		<div class="bg-panel bt bb pad-md text-sm text-secondary">
			Edge-to-edge callout band inside a padded container.
		</div>
	</Bleed>
	<CardContent>Subsequent body content respects the container padding again.</CardContent>
</Card>
