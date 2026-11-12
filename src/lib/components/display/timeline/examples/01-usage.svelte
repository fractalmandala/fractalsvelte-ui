<!-- @example Usage :: A production deploy, from the build to promotion. -->
<script lang="ts">
	import { Timeline } from '@fractaldesign/fractalsvelte-ui';
</script>

<Timeline
	class="measure-md"
	items={[
		{
			title: 'Build passed',
			description: 'Type check, lint and the component gate all came back clean.',
			time: '06:04'
		},
		{
			title: 'Deployed to staging',
			description: 'mintfolio-staging.fly.dev is running 0.8.4.',
			time: '06:11'
		},
		{
			title: 'Canary at 10%',
			description: 'Edge traffic in eu-west-1 is on the new revision. Error rate is unchanged.',
			time: '06:18'
		},
		{
			title: 'Promoted to production',
			description: 'All regions are on 0.8.4. The previous revision is still available to roll back.',
			time: '06:27'
		}
	]}
/>
