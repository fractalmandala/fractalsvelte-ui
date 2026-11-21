<!-- @component A hairline between rows in a group. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHRElement> {}

	let { class: className, ...rest }: Props = $props();
</script>

<hr class={['border-none bt wfull', className]} {...rest} />
