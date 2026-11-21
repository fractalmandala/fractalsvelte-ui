<!-- @example Padding :: Card renders one inset for all its parts; the padding comes from the card's own surface, not a prop. -->
<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-bs">
	<Card surface="outlined" class="measure-xs">
		<CardHeader>
			<CardTitle>Retention policy</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-sm text-secondary">Snapshots are kept for thirty days, then archived.</p>
		</CardContent>
	</Card>
	<Card surface="paneled" class="measure-xs">
		<CardHeader>
			<CardTitle>Access review</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-sm text-secondary">Reviewers are re-confirmed every quarter.</p>
		</CardContent>
	</Card>
</div>

<div class="box gap-xs">
	<Card surface="outlined" class="measure-xs">
		<CardContent textColor="text-primary">Content ink is a prop, not a constant.</CardContent>
		<CardDescription textColor="text-muted">A description carries its own ink.</CardDescription>
	</Card>
</div>
