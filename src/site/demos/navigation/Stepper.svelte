<script lang="ts">
	import Stepper from '$lib/components/navigation/Stepper.svelte';

	const steps = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Review' }];
</script>

<Stepper {steps} />
