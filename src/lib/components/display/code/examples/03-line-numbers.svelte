<!-- @example Line numbers and marks :: A gutter of line numbers, with a range of marked lines. -->
<script lang="ts">
	import { Code } from '@fractaldesign/fractalsvelte-ui';

	const close = '<' + '/script>';
	const source = `<script lang="ts">
	import { SpringValue } from '@fractaldesign/fractalsvelte-ui/motion';

	const count = new SpringValue(0, 'gentle');

	export function play(target: number): Promise<void> {
		return count.set(target);
	}
${close}

<p class="tabular-nums">{count.current}</p>
`;
</script>

<Code
	code={source}
	lang="svelte"
	filename="CountUp.svelte"
	showLineNumbers={true}
	highlightLines={[6, 7, 8]}
/>
