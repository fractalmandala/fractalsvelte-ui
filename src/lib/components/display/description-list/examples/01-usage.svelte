<!-- @example Usage :: Instance metadata, stacked as term over definition. -->
<script lang="ts">
	import { DescriptionList } from '@fractaldesign/fractalsvelte-ui';

	const instance = [
		{ term: 'Region', description: 'eu-west-1' },
		{ term: 'Instance type', description: 'c7g.xlarge' },
		{ term: 'Availability zone', description: 'eu-west-1b' },
		{ term: 'AMI', description: 'ami-0f7c9c8a1b4e2d310' },
		{ term: 'VPC', description: 'vpc-0a12b34c56d78e90f' },
		{ term: 'Launched', description: '12 Nov 2026, 06:18 IST' }
	];
</script>

<DescriptionList items={instance} class="measure-sm" />
