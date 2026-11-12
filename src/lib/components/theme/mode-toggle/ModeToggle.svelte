<!-- @component Switches between light, dark and system mode with a circular reveal from the click point. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luMonitor, luMoon, luSun } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { roving } from '../../../internal/roving.js';
	import { heightClass, textClass, type Size } from '../../../internal/tokens.js';
	import { startViewTransition, vars } from '../../../motion/index.js';
	import { theme, type ThemeMode } from '../../../theme/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'role'> {
		/** The control: a single `icon` button, a `switch`, or a `segmented` radio group. */
		variant?: 'icon' | 'switch' | 'segmented';
		/** The control height and text scale. */
		size?: Size;
		/** Adds the `system` (follow the OS) option: a third segment, or a third step when the icon button is pressed. The switch is always two-state. */
		withSystem?: boolean;
		/** The mode. Bindable. Leave it undefined to read and write the shared `theme`; pass a mode to control the component yourself. */
		value?: ThemeMode;
		/** Called with the new mode whenever the person changes it. */
		onValueChange?: (value: ThemeMode) => void;
		/** The accessible name of the control. */
		label?: string;
	}

	let {
		variant = 'icon',
		size = 'md',
		withSystem = false,
		value = $bindable(),
		onValueChange,
		label = 'Dark mode',
		class: klass,
		...rest
	}: Props = $props();

	const current = $derived<ThemeMode>(value ?? theme.mode);
	const dark = $derived(current === 'system' ? theme.systemDark : current === 'dark');
	const shown = $derived<ThemeMode>(withSystem && current === 'system' ? current : resolved(dark));
	const cycle = $derived<ThemeMode>(
		!withSystem ? resolved(!dark) : current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
	);
	function resolved(isDark: boolean): ThemeMode {
		return isDark ? options[1].mode : options[0].mode;
	}
	const options: { mode: ThemeMode; name: string; icon: typeof luSun }[] = [
		{ mode: 'light', name: 'Light', icon: luSun },
		{ mode: 'dark', name: 'Dark', icon: luMoon },
		{ mode: 'system', name: 'System', icon: luMonitor }
	];
	const choices = $derived(withSystem ? options : options.filter((o) => o.mode !== 'system'));

	/** The click point, or the control's centre for keyboard activation. */
	function originOf(event: MouseEvent): MouseEvent | Element {
		return event.detail === 0 && event.currentTarget instanceof Element ? event.currentTarget : event;
	}

	function change(next: ThemeMode, event: MouseEvent): void {
		if (next === current) return;
		const origin = originOf(event);
		if (value === undefined) {
			if (!withSystem && next !== 'system') void theme.toggleMode(origin);
			else void theme.setMode(next, origin);
		} else {
			void startViewTransition(() => { value = next; }, { type: 'reveal', origin });
		}
		onValueChange?.(next);
	}
</script>

{#snippet glyphs()}
	<span class="swap" aria-hidden="true">
		<Icon icon={luSun} class={shown === 'light' ? 'selected' : undefined} />
		<Icon icon={luMoon} class={shown === 'dark' ? 'selected' : undefined} />
		{#if withSystem}
			<Icon icon={luMonitor} class={shown === 'system' ? 'selected' : undefined} />
		{/if}
	</span>
{/snippet}

{#if variant === 'icon'}
	<Button
		{...rest}
		variant="ghost"
		{size}
		class={['btn-icon', klass]}
		aria-label={withSystem ? `${label}: ${current}. Switch to ${cycle}` : label}
		aria-pressed={withSystem ? undefined : dark}
		title={withSystem ? `Mode: ${current}` : label}
		onclick={(event: MouseEvent) => change(cycle, event)}
	>
		{@render glyphs()}
	</Button>
{:else if variant === 'switch'}
	<button
		type="button"
		role="switch"
		aria-checked={dark}
		aria-label={label}
		class={['bare rocker track', textClass[size], klass]}
		{@attach vars({ value: dark ? 1 : 0 })}
		{...rest}
		onclick={(event: MouseEvent) => change(resolved(!dark), event)}
	>
		<span class="thumb text-black"><span class="swap" aria-hidden="true">
			<Icon icon={luSun} class={!dark ? 'selected' : undefined} />
			<Icon icon={luMoon} class={dark ? 'selected' : undefined} />
		</span></span>
	</button>
{:else}
	<div
		role="radiogroup"
		aria-label={label}
		class={['choice-group', heightClass[size], textClass[size], klass]}
		{@attach roving({ orientation: 'horizontal', onNavigate: (item) => item.click() })}
		{...rest}
	>
		{#each choices as option (option.mode)}
			{@const on = option.mode === (withSystem ? current : resolved(dark))}
			<button
				type="button"
				role="radio"
				aria-checked={on}
				tabindex={on ? 0 : -1}
				class="bare choice weight-500"
				onclick={(event) => change(option.mode, event)}
			>
				<Icon icon={option.icon} />
				{option.name}
			</button>
		{/each}
	</div>
{/if}
