<!-- @example Usage :: A self-contained editor: changes stay on the preview, not on the page. -->
<script lang="ts">
	import { ThemeCustomizer } from '@fractaldesign/fractalsvelte-ui';
	import { defaultTheme, type ThemeSettings } from '@fractaldesign/fractalsvelte-ui/theme';

	let settings = $state<ThemeSettings>({ ...defaultTheme, theme: 'ocean', mode: 'dark' });
</script>

<ThemeCustomizer bind:value={settings} class="measure-md" />
