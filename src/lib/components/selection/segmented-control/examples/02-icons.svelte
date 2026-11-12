<!-- @example Icons :: Segments with a leading icon, and onValueChange reporting each choice. -->
<script lang="ts">
	import { SegmentedControl } from '@fractaldesign/fractalsvelte-ui';
	import { luCode, luEye, luFileText } from '@fractaldesign/icons/lucide';

	let mode = $state('preview');
	const options = [
		{ value: 'preview', label: 'Preview', icon: luEye },
		{ value: 'source', label: 'HTML', icon: luCode },
		{ value: 'markdown', label: 'Markdown', icon: luFileText }
	];
</script>

<div class="box gap-sm">
	<SegmentedControl
		{options}
		bind:value={mode}
		label="Editor mode"
		onValueChange={(v) => console.info('mode', v)}
	/>
	<p class="text-sm text-muted">Editing as {mode}</p>
</div>
