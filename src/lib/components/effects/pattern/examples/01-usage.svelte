<!-- @example Usage :: A feature section sitting on a softly faded grid. -->
<script lang="ts">
	import { Pattern } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="relative overflow-hidden curved pad-xl box gap-sm bg-surface border-subtle">
	<Pattern variant="grid" fade="radial" />
	<p class="text-sm text-muted">Analytics</p>
	<p class="card-title">Ship, then watch the graph</p>
	<p class="text-body-sm text-secondary measure-md">Requests, errors and p95 sit on the same timeline, so a deploy and a spike can be read together.</p>
</div>
