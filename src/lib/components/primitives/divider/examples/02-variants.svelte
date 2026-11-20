<!-- @example Variants :: Four line styles. Solid is the default; dashed suggests a draft or a cut, subtle recedes, strong divides major sections. -->
<script lang="ts">
	import { Divider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box measure-sm gap-xs">
	<p class="text-sm text-muted">Solid</p>
	<Divider look="solid" spacing="h-xs" />
	<p class="text-sm text-muted">Dashed</p>
	<Divider look="dashed" spacing="h-xs" />
	<p class="text-sm text-muted">Subtle</p>
	<Divider look="subtle" spacing="h-xs" />
	<p class="text-sm text-muted">Strong</p>
	<Divider look="strong" spacing="h-xs" />
</div>
