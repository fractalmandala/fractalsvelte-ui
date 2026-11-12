<!-- @example Vertical, error and icons :: A vertical pipeline, an error on one step, and icons in the markers. -->
<script lang="ts">
	import { Stepper } from '@fractaldesign/fractalsvelte-ui';
	import { luFile, luSearch, luPackage, luCheck } from '@fractaldesign/icons/lucide';

	let value = $state<string | null>('review');
</script>

<Stepper
	bind:value
	orientation="vertical"
	steps={[
		{ value: 'draft', label: 'Draft filed', description: 'Tuesday at 14:10', icon: luFile, status: 'complete' },
		{ value: 'review', label: 'Fact check', description: 'Two queries still open', icon: luSearch, status: 'error' },
		{ value: 'layout', label: 'Layout', description: 'Waiting on review', icon: luPackage, status: 'upcoming' },
		{ value: 'press', label: 'To press', description: 'Friday evening', icon: luCheck, status: 'upcoming' }
	]}
/>
