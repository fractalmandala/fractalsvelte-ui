<script lang="ts">
	import { PortedButton } from '#lib/ported/index.ts';
	import type { PortedButtonSize, PortedButtonVariant } from '#lib/ported/index.ts';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { Icon } from 'fractalicons';
	import { luBell } from 'fractalicons/lucide';
	import { highlight } from '#lib/docs/highlight.ts';

	import PortedButtonVariants from './demos/PortedButtonVariants.svelte';
	import portedButtonVariantsRaw from './demos/PortedButtonVariants.svelte?raw';
	import PortedButtonSizes from './demos/PortedButtonSizes.svelte';
	import portedButtonSizesRaw from './demos/PortedButtonSizes.svelte?raw';
	import PortedButtonIconSizes from './demos/PortedButtonIconSizes.svelte';
	import portedButtonIconSizesRaw from './demos/PortedButtonIconSizes.svelte?raw';
	import PortedButtonWithIcons from './demos/PortedButtonWithIcons.svelte';
	import portedButtonWithIconsRaw from './demos/PortedButtonWithIcons.svelte?raw';
	import PortedButtonStates from './demos/PortedButtonStates.svelte';
	import portedButtonStatesRaw from './demos/PortedButtonStates.svelte?raw';
	import PortedButtonAnchor from './demos/PortedButtonAnchor.svelte';
	import portedButtonAnchorRaw from './demos/PortedButtonAnchor.svelte?raw';

	let variant = $state<PortedButtonVariant>('default');
	let size = $state<PortedButtonSize>('default');
	let disabled = $state(false);
	let label = $state('Save changes');

	const isIcon = $derived(size.startsWith('icon'));

	const playgroundCode = $derived(
		`<script>\n\timport { PortedButton } from 'fractalsvelte/ported';\n<\/script>\n\n<PortedButton\n\tvariant="${variant}"\n\tsize="${size}"${disabled ? '\n\tdisabled' : ''}\n>\n\t${isIcon ? '··· icon ···' : label}\n</PortedButton>`
	);

	let highlightedPlayground = $state<string>('');

	$effect(() => {
		let active = true;
		highlight(playgroundCode, 'svelte').then((res) => {
			if (active) highlightedPlayground = res;
		});
		return () => {
			active = false;
		};
	});
</script>

<div class="stack gap-m">
	<section class="card pad-m stack gap-s" aria-labelledby="ported-playground-heading">
		<strong id="ported-playground-heading" class="text-md weight-600">Interactive Playground</strong>
		<div class="row wrap gap-s">
			<label class="field">
				<span class="field-label">Variant</span>
				<select class="select" bind:value={variant}>
					<option value="default">default</option>
					<option value="secondary">secondary</option>
					<option value="outline">outline</option>
					<option value="ghost">ghost</option>
					<option value="destructive">destructive</option>
					<option value="link">link</option>
				</select>
			</label>
			<label class="field">
				<span class="field-label">Size</span>
				<select class="select" bind:value={size}>
					<option value="xs">xs</option>
					<option value="sm">sm</option>
					<option value="default">default</option>
					<option value="lg">lg</option>
					<option value="icon-xs">icon-xs</option>
					<option value="icon-sm">icon-sm</option>
					<option value="icon">icon</option>
					<option value="icon-lg">icon-lg</option>
				</select>
			</label>
			<label class="field">
				<span class="field-label">Label</span>
				<input class="input" type="text" bind:value={label} disabled={isIcon} />
			</label>
			<label class="field">
				<span class="field-label">State</span>
				<span class="row ycenter gap-2xs">
					<input type="checkbox" bind:checked={disabled} />
					<span class="text-sm">Disabled</span>
				</span>
			</label>
		</div>
		<div class="row ycenter xcenter pad-m surface radius-8 border">
			{#if isIcon}
				<PortedButton {variant} {size} {disabled} aria-label={label}>
					<Icon icon={luBell} />
				</PortedButton>
			{:else}
				<PortedButton {variant} {size} {disabled}>{label}</PortedButton>
			{/if}
		</div>
		<div class="playground__code-content">
			{#if highlightedPlayground}
				{@html highlightedPlayground}
			{:else}
				<pre><code>{playgroundCode}</code></pre>
			{/if}
		</div>
	</section>

	<DemoCard
		title="Variants"
		description="All six shadcn intents. Default maps to the fractal primary treatment."
		code={portedButtonVariantsRaw}
	>
		<PortedButtonVariants />
	</DemoCard>

	<DemoCard
		title="Sizes"
		description="Text sizes snap to the nearest fractal density: xs→sm (26px), sm/default→md (32px), lg→lg (38px)."
		code={portedButtonSizesRaw}
	>
		<PortedButtonSizes />
	</DemoCard>

	<DemoCard
		title="Icon sizes"
		description="Square icon densities. Always pair with an aria-label."
		code={portedButtonIconSizesRaw}
	>
		<PortedButtonIconSizes />
	</DemoCard>

	<DemoCard
		title="With icons"
		description="Inline icons compose via fractalicons; spacing follows the button gap."
		code={portedButtonWithIconsRaw}
	>
		<PortedButtonWithIcons />
	</DemoCard>

	<DemoCard
		title="States"
		description="Disabled blocks interaction at 50% opacity — the same contract as the fractal button."
		code={portedButtonStatesRaw}
	>
		<PortedButtonStates />
	</DemoCard>

	<DemoCard
		title="Anchor"
		description="Passing href renders an anchor that keeps every visual state."
		code={portedButtonAnchorRaw}
	>
		<PortedButtonAnchor />
	</DemoCard>
</div>
