<!-- @example Children :: Composed TimelineItem children, including extra content in one event. -->
<script lang="ts">
	import { luCircleCheck } from '@fractaldesign/icons/lucide';
	import { Button, Timeline, TimelineItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<Timeline class="measure-md">
	<TimelineItem title="Build passed" time="06:04" icon={luCircleCheck} tone="success">
		<p class="text-sm text-secondary">The gate finished in 47 seconds.</p>
	</TimelineItem>
	<TimelineItem
		title="Ready to promote"
		description="Staging has been healthy for twenty minutes."
		time="06:31"
	>
		<Button size="sm">Promote 0.8.4</Button>
	</TimelineItem>
</Timeline>
