<!-- @example Spacing :: The space on either side of the rule, from the shared size ladder. Choose the step that matches the gap between the blocks it separates. -->
<script lang="ts">
	import { Divider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box measure-sm">
	<p class="text-sm text-muted">xs</p>
	<Divider spacing="h-xs" />
	<p class="text-sm text-muted">sm</p>
	<Divider spacing="h-sm" />
	<p class="text-sm text-muted">md</p>
	<Divider spacing="h-md" />
	<p class="text-sm text-muted">lg</p>
	<Divider spacing="h-lg" />
	<p class="text-sm text-muted">xl</p>
	<Divider spacing="h-xl" />
	<p class="text-sm text-muted">bs</p>
	<Divider spacing="h-bs" />
	<p class="text-sm text-muted">2xl</p>
	<Divider spacing="h-2xl" />
	<p class="text-sm text-muted">3xl</p>
	<Divider spacing="h-3xl" />
</div>
