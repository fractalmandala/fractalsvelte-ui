<!-- @example Duration, size, delay and direction :: A longer delayed beam, and a short one running the other way. -->
<script lang="ts">
	import { BorderBeam } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-bs">
	<div class="relative overflow-hidden card box bg-surface border-subtle curved pad-lg gap-sm">
		<BorderBeam duration={12} size="16%" delay={1} />
		<p class="card-title">Longer, later</p>
		<p class="card-desc text-secondary">A wider beam that waits a second, then takes twelve seconds to go around.</p>
	</div>
	<div class="relative overflow-hidden card box bg-surface border-subtle curved pad-lg gap-sm">
		<BorderBeam duration={5} size="5%" reverse />
		<p class="card-title">Short and reversed</p>
		<p class="card-desc text-secondary">A tight beam travelling the other way, a little quicker.</p>
	</div>
</div>
