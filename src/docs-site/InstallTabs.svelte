<script lang="ts">
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		/** The packages to add. */
		packages?: string[];
	}

	let { packages = ['@fractaldesign/fractalsvelte-ui', '@fractaldesign/fractalstyler'] }: Props = $props();

	const managers = [
		{ id: 'pnpm', cmd: 'pnpm add' },
		{ id: 'npm', cmd: 'npm install' },
		{ id: 'yarn', cmd: 'yarn add' },
		{ id: 'bun', cmd: 'bun add' }
	] as const;

	let active = $state<string>('pnpm');
	const uid = $props.id();
	const command = $derived(`${managers.find((m) => m.id === active)?.cmd ?? 'pnpm add'} ${packages.join(' ')}`);

	function onkeydown(event: KeyboardEvent) {
		const i = managers.findIndex((m) => m.id === active);
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		active = managers[(i + step + managers.length) % managers.length].id;
		document.getElementById(`${uid}-${active}`)?.focus();
	}
</script>

<div class="border radius-bs bg-panel overflow-hidden">
	<div class="row ycenter gap-xs px-sm py-xs bb-sub" role="tablist" aria-label="Package manager" tabindex="-1" {onkeydown}>
		{#each managers as m (m.id)}
			<button
				type="button"
				role="tab"
				id="{uid}-{m.id}"
				aria-selected={active === m.id}
				aria-controls="{uid}-panel"
				tabindex={active === m.id ? 0 : -1}
				class={['ghost h-bs px-md mincurved text-sm font-mono', active === m.id ? 'selected text-primary' : 'text-muted']}
				onclick={() => (active = m.id)}
			>
				{m.id}
			</button>
		{/each}
	</div>
	<div id="{uid}-panel" role="tabpanel" aria-labelledby="{uid}-{active}">
		<CodeBlock code={command} lang="bash" bare />
	</div>
</div>
