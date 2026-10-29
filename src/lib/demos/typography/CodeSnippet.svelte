<script lang="ts">
	import { CodeSnippet } from '$lib/styler';
</script>

<div class="box gap-lg">
	<CodeSnippet language="ts" code={`import { CodeSnippet } from '@fractaldesign/fractalsvelte-ui';\n\nconst greeting: string = 'hello';`} />
	<CodeSnippet
		language="bash"
		code="pnpm add @fractaldesign/fractalsvelte-ui"
		manual={'<' + `script lang="ts">\n\timport { Button } from '@fractaldesign/fractalsvelte-ui';\n<` + `/script>\n\n<Button>Click</Button>`}
		manualLanguage="svelte"
	/>
</div>
