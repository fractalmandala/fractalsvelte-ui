<script lang="ts">
	// Page template section 2: install by CLI command, or copy the full source by hand.
	import CodeSnippet from './CodeSnippet.svelte';

	interface Props {
		/** Component name as exported from lib/components/index.ts, e.g. "Button". */
		name: string;
		/** Path under lib/components without extension, e.g. "actions/Button". */
		path: string;
	}

	let { name, path }: Props = $props();

	const sources = import.meta.glob<string>('$lib/components/**/*.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	});
	const source = $derived(sources[`/src/lib/components/${path}.svelte`] ?? '');
	const command = $derived(`pnpm dlx fractalsvelte-ui@latest add ${name.toLowerCase()}`);
</script>

<CodeSnippet code={command} language="bash" manual={source} manualLanguage="svelte" />
