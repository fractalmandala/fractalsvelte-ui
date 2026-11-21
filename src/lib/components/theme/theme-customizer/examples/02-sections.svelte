<!-- @example Sections :: Only colour and motion, on a flat panel with roomier padding, with onValueChange reporting each edit and the preview, reset and copy buttons restyled through their own props bags. -->
<script lang="ts">
	import { ThemeCustomizer } from '@fractaldesign/fractalsvelte-ui';
	import { defaultTheme, type ThemeSettings } from '@fractaldesign/fractalsvelte-ui/theme';

	let settings = $state<ThemeSettings>({ ...defaultTheme, theme: 'ember' });
	let edits = $state(0);
</script>

<ThemeCustomizer
	bind:value={settings}
	sections={['color', 'motion', 'preview']}
	textSize="text-md"
	childTextSize="text-sm"
	childTextColor="text-secondary"
	surface="outlined"
	previewButtonProps={{ shape: 'round' }}
	resetButtonProps={{ variant: 'outline' }}
	copyButtonProps={{ textSize: 'text-xs' }}
	onValueChange={() => edits++}
	class="measure-md"
/>
