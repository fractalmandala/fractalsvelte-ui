<script lang="ts">
	import { Stepper } from '@fractaldesign/fractalsvelte-ui';

	const steps = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Review' }];
</script>

<Stepper {steps} />
