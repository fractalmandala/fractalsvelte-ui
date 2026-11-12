<!-- @component A password field with a reveal toggle, an optional strength meter, and a Caps Lock hint. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luEye, luEyeOff } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import type { Shape, Size } from '../../../internal/tokens.js';
	import { Input } from '../input/index.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'type' | 'children'> {
		/** The password. Bindable; works controlled and uncontrolled. */
		value?: string;
		/** Called with the new text whenever it changes. */
		onValueChange?: (value: string) => void;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		variant?: 'outline' | 'filled' | 'ghost';
		/** Marks the field invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** Shows a strength meter under the field, scored from the length and the mix of character classes. */
		strength?: boolean;
		/** The underlying `<input>` element. Bindable. */
		ref?: HTMLInputElement | null;
	}

	let {
		value = $bindable(''),
		onValueChange,
		size,
		textSize,
		shape,
		variant,
		invalid,
		strength = false,
		ref = $bindable(null),
		id,
		class: klass,
		onkeydown,
		onkeyup,
		onfocus,
		onblur,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const meterId = `${uid}-strength`;
	const capsId = `${uid}-caps`;

	let revealed = $state(false);
	let capsOn = $state(false);
	let focused = $state(false);

	const score = $derived(scorePassword(value));
	const showCaps = $derived(capsOn && focused && !revealed);
	const describedby = $derived(
		[showCaps ? capsId : null, strength ? meterId : null].filter((v): v is string => Boolean(v)).join(' ') || undefined
	);

	function scorePassword(text: string): { value: number; label: string; tone: 'danger' | 'warning' | 'success' } {
		if (!text) return { value: 0, label: 'Enter a password', tone: 'danger' };
		let points = 0;
		if (text.length >= 8) points += 1;
		if (text.length >= 12) points += 1;
		if (/[a-z]/.test(text) && /[A-Z]/.test(text)) points += 1;
		if (/\d/.test(text)) points += 1;
		if (/[^A-Za-z0-9]/.test(text)) points += 1;
		if (points <= 2) return { value: Math.max(0.15, points / 5), label: 'Weak', tone: 'danger' };
		if (points <= 3) return { value: points / 5, label: 'Fair', tone: 'warning' };
		return { value: points / 5, label: points >= 5 ? 'Excellent' : 'Strong', tone: 'success' };
	}

	function readCaps(event: KeyboardEvent): void {
		capsOn = event.getModifierState('CapsLock');
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		readCaps(event);
		onkeydown?.(event);
	}

	function handleKeyup(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		readCaps(event);
		onkeyup?.(event);
	}
</script>

{#snippet toggle()}
	<button
		type="button"
		class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"
		aria-label={revealed ? 'Hide password' : 'Show password'}
		aria-pressed={revealed}
		tabindex="-1"
		onclick={() => {
			revealed = !revealed;
			ref?.focus();
		}}
	>
		<Icon icon={revealed ? luEyeOff : luEye} />
	</button>
{/snippet}

<div class={['box gap-xs wfull', klass]}>
	<Input
		bind:value
		bind:ref
		{id}
		{size}
		{textSize}
		{shape}
		{variant}
		{invalid}
		{onValueChange}
		type={revealed ? 'text' : 'password'}
		trailing={toggle}
		autocapitalize="off"
		autocomplete="current-password"
		spellcheck="false"
		aria-describedby={describedby}
		onkeydown={handleKeydown}
		onkeyup={handleKeyup}
		onfocus={(event) => {
			focused = true;
			onfocus?.(event);
		}}
		onblur={(event) => {
			focused = false;
			onblur?.(event);
		}}
		{...rest}
	/>
	{#if showCaps}
		<p id={capsId} class="text-sm text-warning">Caps Lock is on.</p>
	{/if}
	{#if strength}
		<div id={meterId} class="box gap-xs">
			<div
				class="track thin wfull"
				role="meter"
				aria-label="Password strength"
				aria-valuemin={0}
				aria-valuemax={1}
				aria-valuenow={score.value}
				aria-valuetext={score.label}
				{@attach vars({ value: score.value })}
			>
				<span class={['fill', score.tone === 'danger' ? 'tone-danger' : score.tone === 'warning' ? 'tone-warning' : 'tone-success']}></span>
			</div>
			<p class={['text-xs', score.tone === 'danger' ? 'text-danger' : score.tone === 'warning' ? 'text-warning' : 'text-success']}>
				{score.label}
			</p>
		</div>
	{/if}
</div>
