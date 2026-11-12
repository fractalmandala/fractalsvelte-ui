<!-- @example Sections :: Only colour and motion, with onValueChange reporting each edit. -->
<script lang="ts">
	import { ThemeCustomizer } from '@fractaldesign/fractalsvelte-ui';
	import { defaultTheme, type ThemeSettings } from '@fractaldesign/fractalsvelte-ui/theme';

	let settings = $state<ThemeSettings>({ ...defaultTheme, theme: 'ember' });
	let edits = $state(0);
</script>

<ThemeCustomizer
	bind:value={settings}
	sections={['color', 'motion', 'preview']}
	onValueChange={() => edits++}
	class="measure-md"
/>
