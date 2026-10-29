<script lang="ts">
	import { Stepper } from '$lib/styler';

	const steps = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Review' }];
</script>

<Stepper {steps} />
