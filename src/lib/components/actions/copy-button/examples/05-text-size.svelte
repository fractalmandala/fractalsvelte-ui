<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { CopyButton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<CopyButton size="lg" textSize="xs" text="pnpm add @fractaldesign/fractalsvelte-ui">Extra-small type</CopyButton>
	<CopyButton size="lg" textSize="sm" text="pnpm add @fractaldesign/fractalsvelte-ui">Small type</CopyButton>
	<CopyButton size="lg" textSize="md" text="pnpm add @fractaldesign/fractalsvelte-ui">Medium type</CopyButton>
	<CopyButton size="lg" textSize="lg" text="pnpm add @fractaldesign/fractalsvelte-ui">Large type</CopyButton>
	<CopyButton size="lg" textSize="xl" text="pnpm add @fractaldesign/fractalsvelte-ui">Extra-large type</CopyButton>
</div>
