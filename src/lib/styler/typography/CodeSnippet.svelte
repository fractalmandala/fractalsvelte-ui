<!-- @component A highlighted code snippet with a language label and copy button. Pass `manual` to get "Command" / "Manual" tabs. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCopy, luCheck } from '@fractaldesign/icons/lucide';
	import { parse, lang, getLanguageConfig, themeStyle, sveltekit, type Theme } from '../../fractalpop';
	import { render } from '../../fractalpop/shared';

	type Tab = 'command' | 'manual';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Code shown by default (the "Command" tab when `manual` is set). */
		code: string;
		/** Language of `code` (name, alias or extension). */
		language?: string;
		/** Code for the "Manual" tab. Setting it turns on the tabs. */
		manual?: string;
		/** Language of `manual`; defaults to `language`. */
		manualLanguage?: string;
		/** Selected tab (bindable). */
		tab?: Tab;
		/** fractalpop theme. */
		theme?: Theme;
		/** How long the tick shows after copying, in ms. */
		resetAfter?: number;
		class?: string;
	}

	let {
		code,
		language = 'plaintext',
		manual,
		manualLanguage,
		tab = $bindable('command'),
		theme = sveltekit,
		resetAfter = 1800,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const tabs: { id: Tab; label: string }[] = [
		{ id: 'command', label: 'Command' },
		{ id: 'manual', label: 'Manual' }
	];

	const tabbed = $derived(manual !== undefined);
	const showManual = $derived(tabbed && tab === 'manual');
	const current = $derived(showManual ? (manual ?? '') : code);
	const currentLang = $derived(showManual ? (manualLanguage ?? language) : language);
	const html = $derived.by(() => {
		const id = lang(currentLang) ?? 'plaintext';
		return render(parse(current, getLanguageConfig(id)));
	});

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(current);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), resetAfter);
		} catch (err) {
			console.error('Failed to copy to clipboard', err);
		}
	}

	function onkeydown(e: KeyboardEvent, i: number) {
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
		e.preventDefault();
		tab = tabs[(i + 1) % tabs.length].id;
		document.getElementById(`${uid}-tab-${tab}`)?.focus();
	}
</script>

<div class="box code-box min radius-sm {className}" {...restProps}>
	<div class="row ycenter xbetween gap-sm px-md py-xs">
		<div class="row ycenter gap-sm min0">
			{#if tabbed}
				<div class="row ycenter gap-xs" role="tablist" aria-orientation="horizontal">
					{#each tabs as t, i (t.id)}
						{@const active = t.id === tab}
						<button
							type="button"
							id="{uid}-tab-{t.id}"
							role="tab"
							class="el-variant el-size el-shape {active ? 'ghost' : 'secondary'} h-md min"
							aria-selected={active}
							aria-controls="{uid}-panel"
							tabindex={active ? 0 : -1}
							onclick={() => (tab = t.id)}
							onkeydown={(e) => onkeydown(e, i)}
						>
							{t.label}
						</button>
					{/each}
				</div>
			{/if}
			<span class="text-xs tt-u weight-600 truncate">{currentLang}</span>
		</div>
		<button
			type="button"
			class="btn-icon el-size el-shape icon ghost h-bs rect"
			aria-label={copied ? 'Copied' : 'Copy code'}
			title={copied ? 'Copied' : 'Copy code'}
			onclick={copy}
		>
			{#if copied}
				<Icon icon={luCheck} class="text-success" />
			{:else}
				<Icon icon={luCopy} />
			{/if}
		</button>
	</div>
	<div
		id="{uid}-panel"
		class="scroll-x" 
		role={tabbed ? 'tabpanel' : undefined}
		aria-labelledby={tabbed ? `${uid}-tab-${tab}` : undefined}
		style={themeStyle(theme)}
	>
		<pre class="pad-md mono text-sm lh16"><code>{@html html}</code></pre>
	</div>
</div>
