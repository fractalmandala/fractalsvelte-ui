<!-- @example Usage :: An icon-only button beside the value it copies. -->
<script lang="ts">
	import { CopyButton } from '@fractaldesign/fractalsvelte-ui';

	const command = 'pnpm add @fractaldesign/fractalsvelte-ui';
</script>

<div class="row ycenter gap-sm border-subtle radius-md pad-sm">
	<code class="text-sm text-secondary">{command}</code>
	<CopyButton text={command} label="Copy install command" />
</div>
