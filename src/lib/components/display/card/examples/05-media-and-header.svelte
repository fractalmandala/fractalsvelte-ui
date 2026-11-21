<!-- @example Media and header action :: Edge-to-edge media in each ratio on its own plate, with a trailing header action, its own gap and alignment, and every footer alignment and gap. -->
<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luEllipsis } from '@fractaldesign/icons/lucide';
	import {
		Button,
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardMedia,
		CardTitle
	} from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="card-grid gap-bs">
	{#each [['16/9', 'left'], ['4/3', 'center'], ['3/2', 'right'], ['1/1', 'between']] as const as [ratio, align] (ratio)}
		<Card>
			<CardMedia
				{ratio}
				src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=70"
				alt="Mountain lake at sunrise"
			/>
			<CardHeader gap="gap-md" alignContent="xbetween">
				<CardTitle level={2}>Lake Louise at dawn</CardTitle>
				<CardDescription>Photographed in {ratio}</CardDescription>
				{#snippet action()}
					<Button variant="ghost" size="h-sm" class="btn-icon" aria-label="More options">
						<Icon icon={luEllipsis} />
					</Button>
				{/snippet}
			</CardHeader>
			<CardContent gap="gap-bs">A two-day trip with an early start and a long walk down.</CardContent>
			<CardFooter {align} gap="gap-md">
				<Button size="h-sm" variant="secondary">Save</Button>
				<Button size="h-sm" variant="ghost">Share</Button>
			</CardFooter>
		</Card>
	{/each}
	<Card surface="paneled">
		<CardMedia ratio="16/9" surface="overlayed" class="grid center text-muted">No photo yet</CardMedia>
		<CardContent>Media can also hold an illustration or a placeholder.</CardContent>
	</Card>
</div>
