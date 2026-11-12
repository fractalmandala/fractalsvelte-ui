<!-- @example Spacing :: The space on either side of the rule, from the shared size ladder. Choose the step that matches the gap between the blocks it separates. -->
<script lang="ts">
	import { Divider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box measure-sm">
	<p class="text-sm text-muted">xs</p>
	<Divider spacing="xs" />
	<p class="text-sm text-muted">sm</p>
	<Divider spacing="sm" />
	<p class="text-sm text-muted">md</p>
	<Divider spacing="md" />
	<p class="text-sm text-muted">lg</p>
	<Divider spacing="lg" />
	<p class="text-sm text-muted">xl</p>
	<Divider spacing="xl" />
</div>
