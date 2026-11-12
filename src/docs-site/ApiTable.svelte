<script lang="ts">
	import type { ApiPart } from '../lib/docs/api-types.js';
	import Rich from './Rich.svelte';

	interface Props {
		/** One component part from api.json. */
		part: ApiPart;
	}

	let { part }: Props = $props();

	const ELEMENTS: Record<string, string> = {
		Anchor: 'a',
		Button: 'button',
		Input: 'input',
		Textarea: 'textarea',
		TextArea: 'textarea',
		Select: 'select',
		Label: 'label',
		Dialog: 'dialog',
		Img: 'img',
		Image: 'img',
		Form: 'form',
		Table: 'table',
		Div: 'div',
		Span: 'span',
		Paragraph: 'p',
		UList: 'ul',
		OList: 'ol',
		LI: 'li',
		Details: 'details',
		Progress: 'progress',
		Meter: 'meter',
		Output: 'output',
		Fieldset: 'fieldset',
		Heading: 'h1–h6',
		Nav: 'nav'
	};

	/** `HTMLButtonAttributes` → `<button>`; `HTMLAttributes<HTMLDivElement>` → `<div>`. */
	function element(text: string): string | null {
		const generic = text.match(/^HTMLAttributes<HTML(\w+)Element>$/);
		if (generic) return ELEMENTS[generic[1]] ?? generic[1].toLowerCase();
		const named = text.match(/^HTML(\w+)Attributes$/);
		if (named) return ELEMENTS[named[1]] ?? named[1].toLowerCase();
		if (text === 'HTMLAttributes') return 'any element';
		return null;
	}

	const inherits = $derived(part.inherits.map((t) => ({ text: t, el: element(t) })));
</script>

<div class="box gap-sm">
	{#if part.props.length}
		<div class="scroll-x border radius-bs">
			<table class="data-table">
				<thead>
					<tr>
						<th scope="col">Prop</th>
						<th scope="col">Type</th>
						<th scope="col">Default</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					{#each part.props as prop (prop.name)}
						<tr>
							<td>
								<div class="box gap-xs xleft">
									<code class="font-mono text-sm weight-500 text-primary">{prop.name}</code>
									<div class="row wrap gap-xs">
										{#if !prop.optional}<span class="tag soft danger text-xs">required</span>{/if}
										{#if prop.bindable}<span class="tag soft text-xs">bind:{prop.name}</span>{/if}
									</div>
								</div>
							</td>
							<td>
								{#if prop.resolvedValues}
									<div class="row wrap gap-xs">
										{#each prop.resolvedValues as v (v)}<code class="code-chip">'{v}'</code>{/each}
									</div>
								{:else}
									<code class="code-chip wrap-any">{prop.type}</code>
								{/if}
							</td>
							<td>
								{#if prop.default !== null}<code class="code-chip wrap-any">{prop.default}</code>{:else}<span class="text-muted">—</span>{/if}
							</td>
							<td class="text-sm text-secondary"><Rich text={prop.description || 'Undocumented.'} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-sm text-muted">{part.name} takes no props of its own.</p>
	{/if}
	{#each inherits as inh (inh.text)}
		<p class="text-sm text-muted">
			{#if inh.el}
				Also accepts all attributes of <code class="code-chip">&lt;{inh.el}&gt;</code> (<code class="code-chip">{inh.text}</code>), spread onto the root element.
			{:else}
				Also accepts <code class="code-chip wrap-any">{inh.text}</code>.
			{/if}
		</p>
	{/each}
</div>
