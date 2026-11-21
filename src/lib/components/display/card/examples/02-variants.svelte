<!-- @example Variants :: Elevated, outline, filled, ghost and glass surfaces. -->
<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="card-grid gap-bs">
	{#each ['elevated', 'outlined', 'paneled', 'vacant', 'glass'] as const as surface (surface)}
		<Card {surface}>
			<CardHeader>
				<CardTitle class="tt-c">{surface}</CardTitle>
				<CardDescription>Release notes for version 2.4</CardDescription>
			</CardHeader>
			<CardContent>Faster startup, a redesigned inspector and 14 fixes.</CardContent>
		</Card>
	{/each}
</div>
