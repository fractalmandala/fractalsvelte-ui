<!-- @example Variants :: Elevated, outline, filled, ghost and glass surfaces. -->
<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="card-grid gap-bs">
	{#each ['elevated', 'outline', 'filled', 'ghost', 'glass'] as const as variant (variant)}
		<Card {variant}>
			<CardHeader>
				<CardTitle class="tt-c">{variant}</CardTitle>
				<CardDescription>Release notes for version 2.4</CardDescription>
			</CardHeader>
			<CardContent>Faster startup, a redesigned inspector and 14 fixes.</CardContent>
		</Card>
	{/each}
</div>
