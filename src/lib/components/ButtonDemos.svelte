<script lang="ts">
	import DemoCard, { type DemoOption } from './DemoCard.svelte';
	import ButtonIntents from './demos/button/ButtonIntents.svelte';
	import buttonIntentsRaw from './demos/button/ButtonIntents.svelte?raw';
	import ButtonStates from './demos/button/ButtonStates.svelte';
	import buttonStatesRaw from './demos/button/ButtonStates.svelte?raw';
	import ButtonSizes from './demos/button/ButtonSizes.svelte';
	import buttonSizesRaw from './demos/button/ButtonSizes.svelte?raw';
	import ButtonPill from './demos/button/ButtonPill.svelte';
	import buttonPillRaw from './demos/button/ButtonPill.svelte?raw';
	import ButtonShapes from './demos/button/ButtonShapes.svelte';
	import buttonShapesRaw from './demos/button/ButtonShapes.svelte?raw';
	import ButtonIcons from './demos/button/ButtonIcons.svelte';
	import buttonIconsRaw from './demos/button/ButtonIcons.svelte?raw';
	import ButtonIconOnly from './demos/button/ButtonIconOnly.svelte';
	import buttonIconOnlyRaw from './demos/button/ButtonIconOnly.svelte?raw';
	import ButtonLoading from './demos/button/ButtonLoading.svelte';
	import buttonLoadingRaw from './demos/button/ButtonLoading.svelte?raw';
	import ButtonFullWidth from './demos/button/ButtonFullWidth.svelte';
	import buttonFullWidthRaw from './demos/button/ButtonFullWidth.svelte?raw';
	import ButtonAnchor from './demos/button/ButtonAnchor.svelte';
	import buttonAnchorRaw from './demos/button/ButtonAnchor.svelte?raw';

	const btnImport = "<script>\n\timport { Button } from 'fractalsvelte/components';\n<\/script>";
	const iconImport = "<script>\n\timport { Button } from 'fractalsvelte/components';\n\timport { Icon } from 'fractalicons';\n\timport { luMail, luArrowRight } from 'fractalicons/lucide';\n<\/script>";
	const iconOnlyImport = "<script>\n\timport { Button } from 'fractalsvelte/components';\n\timport { Icon } from 'fractalicons';\n\timport { luSettings, luBell, luArchive } from 'fractalicons/lucide';\n<\/script>";

	const variantOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonIntentsRaw },
		{ value: 'primary', label: 'Primary', code: `${btnImport}\n\n<Button variant="primary">Primary</Button>` },
		{ value: 'secondary', label: 'Secondary', code: `${btnImport}\n\n<Button variant="secondary">Secondary</Button>` },
		{ value: 'soft', label: 'Soft', code: `${btnImport}\n\n<Button variant="soft">Soft</Button>` },
		{ value: 'outline', label: 'Outline', code: `${btnImport}\n\n<Button variant="outline">Outline</Button>` },
		{ value: 'ghost', label: 'Ghost', code: `${btnImport}\n\n<Button variant="ghost">Ghost</Button>` },
		{ value: 'link', label: 'Link', code: `${btnImport}\n\n<Button variant="link">Link</Button>` },
		{ value: 'destructive', label: 'Destructive', code: `${btnImport}\n\n<Button variant="destructive">Destructive</Button>` }
	];

	const stateOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonStatesRaw },
		{ value: 'disabled', label: 'Disabled', code: `${btnImport}\n\n<Button disabled>Disabled</Button>` },
		{ value: 'outline-disabled', label: 'Outline Disabled', code: `${btnImport}\n\n<Button variant="outline" disabled>Disabled</Button>` },
		{ value: 'destructive-disabled', label: 'Destructive Disabled', code: `${btnImport}\n\n<Button variant="destructive" disabled>Delete workspace</Button>` },
		{ value: 'loading', label: 'Loading', code: `${btnImport}\n\n<Button loading>Working</Button>` }
	];

	const sizeOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonSizesRaw },
		{ value: 'sm', label: 'Small', code: `${btnImport}\n\n<Button size="sm">Small (sm)</Button>` },
		{ value: 'md', label: 'Medium', code: `${btnImport}\n\n<Button size="md">Medium (md)</Button>` },
		{ value: 'bs', label: 'Base', code: `${btnImport}\n\n<Button size="bs">Base (bs)</Button>` },
		{ value: 'lg', label: 'Large', code: `${btnImport}\n\n<Button size="lg">Large (lg)</Button>` }
	];

	const pillOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonPillRaw },
		{ value: 'default', label: 'Default', code: `${btnImport}\n\n<Button>Default</Button>` },
		{ value: 'pill', label: 'Pill', code: `${btnImport}\n\n<Button shape="pill">Pill</Button>` },
		{ value: 'with-icon', label: 'With icon', code: `<script>\n\timport { Button } from 'fractalsvelte/components';\n\timport { Icon } from 'fractalicons';\n\timport { luArrowRight } from 'fractalicons/lucide';\n<\/script>\n\n<Button shape="pill" variant="secondary">\n\tNext\n\t<Icon icon={luArrowRight} />\n</Button>` }
	];

	const shapeOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonShapesRaw },
		{ value: 'square', label: 'Square', code: `${btnImport}\n\n<Button shape="square">Square</Button>` },
		{ value: 'modern', label: 'Modern', code: `${btnImport}\n\n<Button shape="modern">Modern</Button>` },
		{ value: 'curved', label: 'Curved', code: `${btnImport}\n\n<Button shape="curved">Curved</Button>` },
		{ value: 'round', label: 'Round', code: `${btnImport}\n\n<Button shape="round">Round</Button>` }
	];

	const iconOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonIconsRaw },
		{ value: 'leading', label: 'Leading icon', code: `${iconImport}\n\n<Button variant="secondary">\n\t<Icon icon={luMail} />\n\tEmail us\n</Button>` },
		{ value: 'trailing', label: 'Trailing icon', code: `${iconImport}\n\n<Button variant="outline">\n\tContinue\n\t<Icon icon={luArrowRight} />\n</Button>` }
	];

	const iconOnlyOptions: DemoOption[] = [
		{ value: 'all', label: 'All', code: buttonIconOnlyRaw },
		{ value: 'icon-sm', label: 'Small', code: `${iconOnlyImport}\n\n<Button size="icon-sm" variant="ghost" aria-label="Settings">\n\t<Icon icon={luSettings} />\n</Button>` },
		{ value: 'icon', label: 'Medium', code: `${iconOnlyImport}\n\n<Button size="icon" variant="outline" aria-label="Notifications">\n\t<Icon icon={luBell} />\n</Button>` },
		{ value: 'icon-lg', label: 'Large', code: `${iconOnlyImport}\n\n<Button size="icon-lg" variant="soft" aria-label="Archive">\n\t<Icon icon={luArchive} />\n</Button>` }
	];
</script>

<div class="box gap-2xl">
	<DemoCard
		title="Variants"
		description="Activated by using the `variant=` clause in markup inline."
		code={buttonIntentsRaw}
		options={variantOptions}
	>
		{#snippet children(selected)}
			<ButtonIntents {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="States"
		description="Disabled, loading, and combinations with intents. Interactive buttons suppress clicks during loading."
		code={buttonStatesRaw}
		options={stateOptions}
	>
		{#snippet children(selected)}
			<ButtonStates {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="Sizes"
		description="Three scale steps keep typography and touch targets aligned with the fluid type ladder."
		code={buttonSizesRaw}
		options={sizeOptions}
	>
		{#snippet children(selected)}
			<ButtonSizes {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="Pill shape"
		description="Capsule geometry using fully rounded borders; pairs with any intent or size."
		code={buttonPillRaw}
		options={pillOptions}
	>
		{#snippet children(selected)}
			<ButtonPill {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="Shapes"
		description="Standardized shape geometry: square (0px), modern (4px), curved (8px), and round (pill/capsule)."
		code={buttonShapesRaw}
		options={shapeOptions}
	>
		{#snippet children(selected)}
			<ButtonShapes {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="With icons"
		description="Drop an SVG icon directly inside the default slot alongside text."
		code={buttonIconsRaw}
		options={iconOptions}
	>
		{#snippet children(selected)}
			<ButtonIcons {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="Icon only"
		description="Square proportions with aria-label for assistive tech."
		code={buttonIconOnlyRaw}
		options={iconOnlyOptions}
	>
		{#snippet children(selected)}
			<ButtonIconOnly {selected} />
		{/snippet}
	</DemoCard>

	<DemoCard
		title="Loading trigger"
		description="Click to see the loading spinner replace the label, then auto-reset."
		code={buttonLoadingRaw}
	>
		<ButtonLoading />
	</DemoCard>

	<DemoCard
		title="Full width"
		description="Stretch across the parent container using layout utility classes."
		code={buttonFullWidthRaw}
	>
		<ButtonFullWidth />
	</DemoCard>

	<DemoCard
		title="Rendered as link"
		description="Passing an href attribute renders an accessible <a> styled as a button."
		code={buttonAnchorRaw}
	>
		<ButtonAnchor />
	</DemoCard>
</div>
