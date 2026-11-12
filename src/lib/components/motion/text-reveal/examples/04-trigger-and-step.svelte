<!-- @example Trigger and step :: A slower stagger on mount, and a line that waits until it is in view. -->
<script lang="ts">
	import { TextReveal } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<p class="text-xs text-muted">trigger: mount, step: 120</p>
		<TextReveal trigger="mount" step={120} class="text-lg weight-500" text="Set the type, then let the spring do the rest." />
	</div>
	<div class="box gap-xs">
		<p class="text-xs text-muted">trigger: inView</p>
		<TextReveal trigger="inView" as="h2" class="text-xl weight-600" text="A heading that waits for the scroll." />
	</div>
</div>
