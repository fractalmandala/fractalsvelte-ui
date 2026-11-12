<!-- @example Usage :: A frosted panel over a soft aurora, as a short status card. -->
<script lang="ts">
	import { Aurora, Button, GlassPanel } from '@fractaldesign/fractalsvelte-ui';
</script>

<Aurora class="curved pad-2xl">
	<GlassPanel class="measure-sm">
		<p class="text-sm text-muted">Live</p>
		<p class="card-title">Preview is up</p>
		<p class="text-body-sm text-secondary">The night build is on this URL, with logs and a screenshot of the last run.</p>
		<Button size="sm">Open preview</Button>
	</GlassPanel>
</Aurora>
