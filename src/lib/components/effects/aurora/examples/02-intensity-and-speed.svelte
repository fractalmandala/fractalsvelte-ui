<!-- @example Intensity and speed :: A faint slow field beside a stronger, quicker one. -->
<script lang="ts">
	import { Aurora } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-bs">
	<Aurora intensity={0.25} speed={28} class="curved pad-xl box gap-sm">
		<p class="card-title">Quiet</p>
		<p class="text-body-sm text-secondary">A low intensity and a long cycle, for a page that should barely move.</p>
	</Aurora>
	<Aurora intensity={0.7} speed={10} class="curved pad-xl box gap-sm">
		<p class="card-title">Brighter</p>
		<p class="text-body-sm text-secondary">A stronger field that drifts a little faster, still on-theme.</p>
	</Aurora>
</div>
