<!-- @component One disclosure: a heading trigger and a spring-height panel, identified by value. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';
	import { getAccordion, itemClass } from './accordion.svelte.js';
	import { } from '../../../internal/helpers.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value: string;
		title?: string;
		trigger?: Snippet;
		disabled?: boolean;
		children?: Snippet;
	}

	let { value, title, trigger, disabled = false, class: className, children, ...rest }: Props = $props();

	const accordion = getAccordion();
	const open = $derived(accordion.isOpen(value));
	const triggerId = $derived(`${accordion.uid}-${value}-trigger`);
	const panelId = $derived(`${accordion.uid}-${value}-panel`);
	const headingTag = $derived(`h${accordion.headingLevel}`);
</script>

<div class={[itemClass[accordion.grouping], accordion.surface, className]} {...rest}>
	<svelte:element this={headingTag}>
		<button
			id={triggerId}
			type="button"
			class={['item focus-ring', disabled && 'disabled']}
			data-accordion-trigger
			aria-expanded={open}
			aria-controls={panelId}
			disabled={disabled}
			onclick={() => accordion.toggle(value)}
		>
			<span class="grow ta-l">
				{#if trigger}
					{@render trigger()}
				{:else}
					{title}
				{/if}
			</span>
			<span class={['caret spring spring-snappy', open && 'open']}>
				<Icon icon={luChevronDown} />
			</span>
		</button>
	</svelte:element>
	<div id={panelId} class={['collapse spring spring-snappy', open && 'open']} role="region" aria-labelledby={triggerId}>
		<div>
			<div class="pad-md">{@render children?.()}</div>
		</div>
	</div>
</div>
