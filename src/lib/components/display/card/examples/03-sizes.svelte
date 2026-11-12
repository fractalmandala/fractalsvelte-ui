<!-- @example Sizes :: Five sizes scale the padding, gap and type together. -->
<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
		<Card {size} variant="outline" class="measure-md">
			<CardHeader>
				<CardTitle>Storage almost full ({size})</CardTitle>
				<CardDescription>9.4 GB of 10 GB used</CardDescription>
			</CardHeader>
			<CardContent>Archive old projects or upgrade to keep syncing.</CardContent>
		</Card>
	{/each}
</div>
