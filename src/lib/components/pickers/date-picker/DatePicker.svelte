<!-- @component A text field and a popover calendar for picking a single date, with typed parsing and optional presets. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCalendar, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { defaultSize, controlSize, textClass, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import Calendar from '../calendar/Calendar.svelte';
	import { formatIso, parseInput, type DateFormat } from '../calendar/dates.js';

	interface Preset {
		/** The visible name of the preset, e.g. "Today". */
		label: string;
		/** The ISO date the preset writes to `value`. */
		value: string;
	}

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'size' | 'children' | 'type' | 'name' | 'form'> {
		/** The chosen date as ISO `YYYY-MM-DD`, or `null`. Bindable. */
		value?: string | null;
		/** Called whenever the person changes the date. */
		onValueChange?: (value: string | null) => void;
		/** The earliest selectable ISO date. */
		min?: string;
		/** The latest selectable ISO date. */
		max?: string;
		/** How the date is shown in the field. */
		format?: DateFormat;
		/** Shows a button that clears the date. */
		clearable?: boolean;
		/** Quick-pick dates listed above the calendar. */
		presets?: Preset[];
		/** BCP 47 locale for parsing, formatting and calendar labels. */
		locale?: string;
		/** Day the week starts on, 0 = Sunday through 6 = Saturday. */
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of the field. @default 'modern' */
		shape?: Shape;
		/** Marks the field as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** The text shown while no date is chosen. */
		placeholder?: string;
		/** The name of the hidden input that carries the ISO date in a form submission. */
		name?: string;
		/** Whether the calendar is showing. Bindable. */
		open?: boolean;
		/** Called when the calendar opens or closes. */
		onOpenChange?: (open: boolean) => void;
	}

	let {
		value = $bindable(null),
		onValueChange,
		min,
		max,
		format = 'medium',
		clearable = false,
		presets,
		locale,
		weekStartsOn = 0,
		size,
		textSize,
		shape,
		invalid,
		placeholder = 'Pick a date',
		name,
		open = $bindable(false),
		onOpenChange,
		disabled = false,
		id: idProp,
		class: klass,
		...rest
	}: Props = $props();

	const fieldCtx = getFieldContext();
	const resolvedSize = $derived(size ?? fieldCtx?.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? fieldCtx?.shape ?? 'modern');
	const resolvedInvalid = $derived(invalid ?? fieldCtx?.invalid ?? false);

	const uid = $props.id();
	const inputId = $derived(idProp ?? `${uid}-input`);
	const popId = `${uid}-pop`;

	let field = $state<HTMLElement>();
	let input = $state<HTMLInputElement>();
	let pop = $state<HTMLElement>();
	let focused = $state(false);
	let draft = $state('');

	const display = $derived(value ? formatIso(value, locale, format) : '');

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}

	function commit(next: string | null) {
		if (value === next) return;
		value = next;
		onValueChange?.(next);
	}

	function choose(next: string | null) {
		commit(next);
		if (next) {
			draft = formatIso(next, locale, format);
			setOpen(false);
			input?.focus();
		}
	}

	function onFieldInput(event: Event) {
		const next = (event.currentTarget as HTMLInputElement).value;
		draft = next;
		const parsed = parseInput(next, locale);
		if (parsed) {
			const iso = `${String(parsed.y).padStart(4, '0')}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
			if ((!min || iso >= min) && (!max || iso <= max)) commit(iso);
		}
		setOpen(true);
	}

	function onFocus() {
		focused = true;
		draft = value ? formatIso(value, locale, format) : '';
		setOpen(true);
	}

	function onBlur() {
		focused = false;
		const parsed = parseInput(draft, locale);
		if (parsed) {
			const iso = `${String(parsed.y).padStart(4, '0')}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
			if ((!min || iso >= min) && (!max || iso <= max)) {
				commit(iso);
				draft = formatIso(iso, locale, format);
			}
		} else if (!draft.trim()) {
			commit(null);
		} else {
			draft = value ? formatIso(value, locale, format) : '';
		}
		requestAnimationFrame(() => {
			if (field?.contains(document.activeElement) || pop?.contains(document.activeElement)) return;
			setOpen(false);
		});
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && !open) {
			event.preventDefault();
			setOpen(true);
		} else if (event.key === 'Escape' && open) {
			event.preventDefault();
			setOpen(false);
		}
	}

	function clear() {
		commit(null);
		draft = '';
		input?.focus();
	}

	$effect(() => {
		if (!open) return;
		const onDown = (event: PointerEvent) => {
			const target = event.target as Node;
			if (field?.contains(target) || pop?.contains(target)) return;
			setOpen(false);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	});
</script>

<div
	bind:this={field}
	class={[
		'field anchor relative row ycenter xright bg-input border',
		controlSize(resolvedSize, textSize),
		resolvedShape,
		resolvedInvalid && 'is-invalid',
		disabled && 'disabled',
		klass
	]}
	aria-invalid={resolvedInvalid || undefined}
	{@attach anchor(uid)}
>
	<input
		bind:this={input}
		id={inputId}
		type="text"
		class={['cover bare pl-md bg-none text-primary font-sans focus-none', textClass[textSize ?? resolvedSize], resolvedShape, 'pr-2xl']}
		autocomplete="off"
		spellcheck="false"
		role="combobox"
		aria-autocomplete="none"
		aria-invalid={resolvedInvalid || undefined}
		aria-expanded={open}
		aria-controls={popId}
		aria-haspopup="dialog"
		{placeholder}
		{disabled}
		value={focused ? draft : display}
		oninput={onFieldInput}
		onfocus={onFocus}
		onblur={onBlur}
		onkeydown={onKeydown}
		{...rest}
	/>
	<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">
		{#if clearable && value && !disabled}
			<button type="button" class="pointer-auto btn-icon h-md ghost round text-muted" aria-label="Clear date" onclick={clear}>
				<Icon icon={luX} />
			</button>
		{/if}
		<button
			type="button"
			class="pointer-auto btn-icon h-md ghost round text-muted"
			tabindex="-1"
			aria-label="Open calendar"
			disabled={disabled}
			onclick={() => {
				setOpen(!open);
				input?.focus();
			}}
		>
			<Icon icon={luCalendar} />
		</button>
	</span>
</div>

<div
	bind:this={pop}
	id={popId}
	popover="manual"
	role="dialog"
	tabindex="-1"
	aria-label="Choose a date"
	class="floating at-bottom-start pop enter-down spring-snappy glass border rim shad-lg modern pad-bs box gap-sm focus-none"
	{@attach floating(uid)}
	{@attach popoverSync(() => open, setOpen)}
	onpointerdown={(event) => event.preventDefault()}
>
	{#if presets?.length}
		<div class="row wrap gap-xs">
			{#each presets as preset (preset.value)}
				<button type="button" class="button ghost h-bs text-sm modern" onclick={() => choose(preset.value)}>
					{preset.label}
				</button>
			{/each}
		</div>
	{/if}
	<Calendar
		value={value ?? null}
		onValueChange={(v) => typeof v === 'string' || v === null ? choose(v) : undefined}
		{min}
		{max}
		{locale}
		{weekStartsOn}
		disabled={Boolean(disabled)}
		label="Calendar"
	/>
</div>

{#if name}
	<input type="hidden" {name} value={value ?? ''} disabled={disabled || undefined} />
{/if}
