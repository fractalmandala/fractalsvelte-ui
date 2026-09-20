<script lang="ts">
	import DemoCard from './DemoCard.svelte';
	import ButtonIntents from './demos/button/ButtonIntents.svelte';
	import buttonIntentsRaw from './demos/button/ButtonIntents.svelte?raw';
	import ButtonStates from './demos/button/ButtonStates.svelte';
	import buttonStatesRaw from './demos/button/ButtonStates.svelte?raw';
	import ButtonSizes from './demos/button/ButtonSizes.svelte';
	import buttonSizesRaw from './demos/button/ButtonSizes.svelte?raw';
	import ButtonPill from './demos/button/ButtonPill.svelte';
	import buttonPillRaw from './demos/button/ButtonPill.svelte?raw';
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
</script>

<div class="stack gap-m">
	<DemoCard
		title="Intents"
		description="Seven visual intents share one geometry. The legacy danger value still works as an alias of destructive."
		code={buttonIntentsRaw}
	>
		<ButtonIntents />
	</DemoCard>

	<DemoCard
		title="States"
		description="Disabled, loading, and combinations with intents. Interactive buttons suppress clicks during loading."
		code={buttonStatesRaw}
	>
		<ButtonStates />
	</DemoCard>

	<DemoCard
		title="Sizes"
		description="Three scale steps keep typography and touch targets aligned with the fluid type ladder."
		code={buttonSizesRaw}
	>
		<ButtonSizes />
	</DemoCard>

	<DemoCard
		title="Pill shape"
		description="Capsule geometry using fully rounded borders; pairs with any intent or size."
		code={buttonPillRaw}
	>
		<ButtonPill />
	</DemoCard>

	<DemoCard
		title="With icons"
		description="Drop an SVG icon directly inside the default slot alongside text."
		code={buttonIconsRaw}
	>
		<ButtonIcons />
	</DemoCard>

	<DemoCard
		title="Icon only"
		description="Square proportions with aria-label for assistive tech."
		code={buttonIconOnlyRaw}
	>
		<ButtonIconOnly />
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
