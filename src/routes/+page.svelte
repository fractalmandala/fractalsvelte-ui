<script lang="ts">
	import Button from '$lib/components/actions/Button.svelte';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import SplitButton from '$lib/components/actions/SplitButton.svelte';
	import CopyButton from '$lib/components/actions/CopyButton.svelte';

	import Input from '$lib/components/forms/Input.svelte';
	import Switch from '$lib/components/forms/Switch.svelte';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import Slider from '$lib/components/forms/Slider.svelte';
	import PinInput from '$lib/components/forms/PinInput.svelte';
	import ColorPicker from '$lib/components/forms/ColorPicker.svelte';

	import Badge from '$lib/components/display/Badge.svelte';
	import Tag from '$lib/components/display/Tag.svelte';
	import Alert from '$lib/components/display/Alert.svelte';
	import StatCard from '$lib/components/display/StatCard.svelte';
	import Progress from '$lib/components/display/Progress.svelte';
	import Meter from '$lib/components/display/Meter.svelte';
	import Spinner from '$lib/components/display/Spinner.svelte';
	import Kbd from '$lib/components/display/Kbd.svelte';
	import Avatar from '$lib/components/display/Avatar.svelte';
	import AvatarGroup from '$lib/components/display/AvatarGroup.svelte';

	import Card from '$lib/components/layout/Card.svelte';
	import BentoGrid from '$lib/components/layout/BentoGrid.svelte';
	import BentoCell from '$lib/components/layout/BentoCell.svelte';

	import Card3D from '$lib/components/motion/Card3D.svelte';
	import GlowCard from '$lib/components/motion/GlowCard.svelte';
	import FloatingBadge from '$lib/components/motion/FloatingBadge.svelte';
	import TextScramble from '$lib/components/motion/TextScramble.svelte';
	import Marquee from '$lib/components/motion/Marquee.svelte';

	import WorkflowNode from '$lib/components/blocks/WorkflowNode.svelte';
	import HeroBlock from '$lib/components/blocks/HeroBlock.svelte';

	import type { Variant, Size, Shape } from '$lib/types';

	// Interactive state for playground
	let btnVariant = $state<Variant>('primary');
	let btnSize = $state<Size>('md');
	let btnShape = $state<Shape>('rounded');
	let btnLoading = $state(false);

	let testInputValue = $state('fractal-ui@svelte.dev');
	let testSwitch = $state(true);
	let testCheck = $state(true);
	let testSlider = $state(68);
	let testPin = $state('4920');
	let testColor = $state('#10b981');
</script>

<svelte:head>
	<title>Fractal UI — Massive Svelte 5 Runes Component Library</title>
</svelte:head>

<div class="f-home-container">
	<!-- Hero Section -->
	<section class="f-hero-section">
		<div class="f-hero-eyebrow">
			<FloatingBadge variant="primary" pulse>Next-Gen Component Engine</FloatingBadge>
			<span class="f-pill-tag">Zero Tailwind &bull; Pure Tokens</span>
		</div>

		<h1 class="f-hero-title">
			Massive Svelte 5 Component Library for SvelteKit
		</h1>

		<p class="f-hero-subtitle">
			Rebuilt and unified from the finest patterns across <code>fractalstyler</code>, <code>asuras</code>, <code>spanda</code>, <code>metalui</code>, <code>motion-garden</code>, and <code>kinetics</code>. Over <strong>106 performant, reactive components</strong> with encapsulated scoped styles, 5 interchangeable design aesthetic styles (Fractal, Pro UI, BeUI, Halaska, Cyber), light/dark tokens, and an AST-driven zero-drift documentation quality gate.
		</p>

		<div class="f-hero-cta">
			<Button variant="primary" size="lg" shape="pill" href="/components/Button">
				Explore Components
			</Button>
			<Button variant="secondary" size="lg" shape="pill" href="#playgrounds">
				Try Live Playgrounds
			</Button>
			<CopyButton
				text="pnpm add @fractaldesign/fractalsvelte-ui"
				label="pnpm add @fractaldesign/fractalsvelte-ui"
				copiedLabel="Command Copied!"
				size="lg"
				variant="soft"
			/>
		</div>
	</section>

	<!-- Architectural Stats -->
	<section class="f-stats-grid">
		<StatCard
			title="Total Components"
			value="106+"
			deltaType="increase"
			delta="10 categories"
			timeframe="production-ready"
		/>
		<StatCard
			title="Tailwind Dependencies"
			value="0"
			deltaType="neutral"
			delta="100% scoped CSS"
			timeframe="zero leak"
		/>
		<StatCard
			title="Svelte Runes Parity"
			value="100%"
			deltaType="increase"
			delta="$props, $state, $derived"
			timeframe="Svelte 5 native"
		/>
		<StatCard
			title="Documentation Quality"
			value="Zero Drift"
			deltaType="increase"
			delta="AST-extracted"
			timeframe="docs:check gate"
		/>
	</section>

	<!-- Live Playgrounds -->
	<div id="playgrounds" class="f-section-divider">
		<h2 class="f-section-title">Interactive Component Playgrounds</h2>
		<p class="f-section-desc">Experience reactive Svelte 5 runes and scoped token styling in action.</p>
	</div>

	<!-- Playground 1: Actions & Buttons -->
	<Card class="f-playground-card">
		{#snippet header()}
			<div class="f-card-header-inner">
				<h3>Actions & Buttons</h3>
				<span class="f-cat-badge">Category: actions</span>
			</div>
		{/snippet}

		<div class="f-stage-box">
			<Button
				variant={btnVariant}
				size={btnSize}
				shape={btnShape}
				loading={btnLoading}
			>
				Interactive Button
			</Button>

			<IconButton label="Bookmark" variant={btnVariant} size={btnSize} shape={btnShape}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
			</IconButton>

			<SplitButton variant={btnVariant} size={btnSize} shape={btnShape}>
				Publish Post
			</SplitButton>

			<CopyButton text="https://fractal.design" size={btnSize} variant={btnVariant} />
		</div>

		{#snippet footer()}
			<div class="f-controls-row">
				<label class="f-ctrl-label">
					Variant:
					<select bind:value={btnVariant} class="f-ctrl-select">
						<option value="primary">primary</option>
						<option value="secondary">secondary</option>
						<option value="soft">soft</option>
						<option value="outline">outline</option>
						<option value="ghost">ghost</option>
						<option value="destructive">destructive</option>
						<option value="surface">surface</option>
					</select>
				</label>

				<label class="f-ctrl-label">
					Size:
					<select bind:value={btnSize} class="f-ctrl-select">
						<option value="xs">xs</option>
						<option value="sm">sm</option>
						<option value="md">md</option>
						<option value="lg">lg</option>
						<option value="xl">xl</option>
					</select>
				</label>

				<label class="f-ctrl-label">
					Shape:
					<select bind:value={btnShape} class="f-ctrl-select">
						<option value="rounded">rounded</option>
						<option value="pill">pill</option>
						<option value="square">square</option>
					</select>
				</label>

				<label class="f-ctrl-toggle">
					<input type="checkbox" bind:checked={btnLoading} />
					Loading Spinner
				</label>
			</div>
		{/snippet}
	</Card>

	<!-- Playground 2: Form Inputs -->
	<Card class="f-playground-card">
		{#snippet header()}
			<div class="f-card-header-inner">
				<h3>Form Controls & Inputs</h3>
				<span class="f-cat-badge">Category: forms</span>
			</div>
		{/snippet}

		<div class="f-stage-box f-forms-box">
			<div class="f-form-col">
				<Input
					label="Email Address"
					bind:value={testInputValue}
					clearable
					placeholder="user@example.com"
				/>

				<Input
					type="password"
					label="Secure Password"
					value="SecretKey#2026"
					placeholder="Enter password"
				/>

				<Slider
					label="Volume Level"
					bind:value={testSlider}
					min={0}
					max={100}
				/>
			</div>

			<div class="f-form-col">
				<PinInput
					label="Two-Factor OTP Code"
					bind:value={testPin}
					length={4}
				/>

				<div class="f-toggles-row">
					<Switch label="Push Notifications" bind:checked={testSwitch} />
					<Checkbox label="Agree to Terms" bind:checked={testCheck} />
				</div>

				<ColorPicker label="Brand Primary Color" bind:value={testColor} />
			</div>
		</div>
	</Card>

	<!-- Playground 3: Motion & Animated Components -->
	<Card class="f-playground-card">
		{#snippet header()}
			<div class="f-card-header-inner">
				<h3>Motion, 3D & Micro-Interactions</h3>
				<span class="f-cat-badge">Category: motion</span>
			</div>
		{/snippet}

		<div class="f-motion-grid">
			<Card3D maxTilt={15}>
				<div class="f-demo-card-inner">
					<Badge variant="primary">3D Tilt Card</Badge>
					<h4>Interactive Tilt</h4>
					<p>Tracks cursor coordinates with real-time perspective and glare simulation.</p>
				</div>
			</Card3D>

			<GlowCard glowColor="rgba(16, 185, 129, 0.45)">
				<div class="f-demo-card-inner">
					<Badge variant="success">Radial Spotlight</Badge>
					<h4>Glow Card</h4>
					<p>Illuminates border geometry along radial cursor proximity.</p>
				</div>
			</GlowCard>

			<div class="f-demo-card-inner f-scramble-box">
				<Badge variant="warning">Cyberpunk Scramble</Badge>
				<h4>
					<TextScramble text="QUANTUM DECRYPTED" speed={40} />
				</h4>
				<p>Character-level decode transformation with glyph shuffling.</p>
			</div>
		</div>

		<div class="f-marquee-wrapper">
			<Marquee speed={35} pauseOnHover>
				<span class="f-marquee-item">⚡ 91+ Svelte 5 Runes Components</span>
				<span class="f-marquee-item">🎨 Token-Driven CSS Variables</span>
				<span class="f-marquee-item">🚫 Zero Tailwind Bloat</span>
				<span class="f-marquee-item">💎 AST Documentation Quality Gate</span>
				<span class="f-marquee-item">📦 Scoped Portable Styles</span>
			</Marquee>
		</div>
	</Card>

	<!-- Playground 4: Visual Workflow Node Canvas -->
	<Card class="f-playground-card">
		{#snippet header()}
			<div class="f-card-header-inner">
				<h3>Workflow Automation Blocks</h3>
				<span class="f-cat-badge">Category: blocks</span>
			</div>
		{/snippet}

		<div class="f-flow-preview-canvas">
			<WorkflowNode
				title="Webhook Trigger"
				subtitle="POST /api/v1/event"
				status="success"
				outputs={[{ id: 'out-1', label: 'Payload Data' }]}
			/>

			<div class="f-flow-connector">&rarr;</div>

			<WorkflowNode
				title="LLM Transformer"
				subtitle="gemini-3.8-flash"
				status="running"
				inputs={[{ id: 'in-1', label: 'Prompt Input' }]}
				outputs={[{ id: 'out-2', label: 'Agent Response' }]}
			/>

			<div class="f-flow-connector">&rarr;</div>

			<WorkflowNode
				title="Database Insert"
				subtitle="PostgreSQL Cluster"
				status="idle"
				inputs={[{ id: 'in-2', label: 'Vector Record' }]}
			/>
		</div>
	</Card>

	<!-- Design Tokens Palette Guide -->
	<div id="tokens" class="f-section-divider">
		<h2 class="f-section-title">Design Tokens System</h2>
		<p class="f-section-desc">Unified variables defining colors, surfaces, borders, and depth across light and dark modes.</p>
	</div>

	<BentoGrid columns={3}>
		<BentoCell title="Primary Theme">
			<div class="f-token-swatches">
				<div class="f-swatch" style="background: var(--f-primary)">
					<span>--f-primary</span>
				</div>
				<div class="f-swatch" style="background: var(--f-primary-hover)">
					<span>--f-primary-hover</span>
				</div>
				<div class="f-swatch" style="background: var(--f-primary-subtle); color: var(--f-primary)">
					<span>--f-primary-subtle</span>
				</div>
			</div>
		</BentoCell>

		<BentoCell title="Semantic Status">
			<div class="f-token-swatches">
				<div class="f-swatch" style="background: var(--f-success); color: #fff">
					<span>--f-success</span>
				</div>
				<div class="f-swatch" style="background: var(--f-warning); color: #000">
					<span>--f-warning</span>
				</div>
				<div class="f-swatch" style="background: var(--f-danger); color: #fff">
					<span>--f-danger</span>
				</div>
			</div>
		</BentoCell>

		<BentoCell title="Surfaces & Depth">
			<div class="f-token-swatches">
				<div class="f-swatch f-border-swatch" style="background: var(--f-bg); color: var(--f-text)">
					<span>--f-bg</span>
				</div>
				<div class="f-swatch f-border-swatch" style="background: var(--f-surface); color: var(--f-text)">
					<span>--f-surface</span>
				</div>
				<div class="f-swatch f-border-swatch" style="background: var(--f-raised); color: var(--f-text)">
					<span>--f-raised</span>
				</div>
			</div>
		</BentoCell>
	</BentoGrid>
</div>

<style>
	.f-home-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 3rem 1.5rem 6rem 1.5rem;
		box-sizing: border-box;
	}

	.f-hero-section {
		text-align: center;
		padding: 2.5rem 0 3.5rem 0;
	}

	.f-hero-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.f-pill-tag {
		font-size: var(--f-text-xs);
		font-weight: 600;
		color: var(--f-text-muted);
		background: var(--f-sunken);
		padding: 4px 10px;
		border-radius: var(--f-radius-full);
		border: 1px solid var(--f-border);
	}

	.f-hero-title {
		font-size: 3rem;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1.15;
		margin: 0 0 1.25rem 0;
		color: var(--f-text);
		background: linear-gradient(135deg, var(--f-text) 30%, var(--f-primary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.f-hero-subtitle {
		font-size: 1.15rem;
		color: var(--f-text-muted);
		line-height: 1.6;
		max-width: 780px;
		margin: 0 auto 2rem auto;
	}

	.f-hero-subtitle code {
		font-family: var(--f-font-mono);
		font-size: 0.9em;
		color: var(--f-primary);
		background: var(--f-sunken);
		padding: 2px 6px;
		border-radius: var(--f-radius-xs);
	}

	.f-hero-cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.f-stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		margin-bottom: 4rem;
	}

	.f-section-divider {
		margin: 4rem 0 1.5rem 0;
	}

	.f-section-title {
		font-size: var(--f-text-2xl);
		font-weight: 800;
		letter-spacing: -0.02em;
		margin: 0 0 0.35rem 0;
		color: var(--f-text);
	}

	.f-section-desc {
		font-size: var(--f-text-sm);
		color: var(--f-text-muted);
		margin: 0;
	}

	:global(.f-playground-card) {
		margin-bottom: 2.5rem;
		box-shadow: var(--f-shadow-md);
	}

	.f-card-header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.f-card-header-inner h3 {
		font-size: var(--f-text-lg);
		font-weight: 700;
		margin: 0;
		color: var(--f-text);
	}

	.f-cat-badge {
		font-size: var(--f-text-xs);
		color: var(--f-primary);
		font-family: var(--f-font-mono);
		background: var(--f-primary-subtle);
		padding: 2px 8px;
		border-radius: var(--f-radius-xs);
	}

	.f-stage-box {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		padding: 3rem 1.5rem;
		background: var(--f-sunken);
		background-image: radial-gradient(var(--f-border) 1px, transparent 1px);
		background-size: 20px 20px;
		border-radius: var(--f-radius-md);
	}

	.f-forms-box {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: start;
	}

	.f-form-col {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.f-toggles-row {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.f-controls-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.25rem;
		font-size: var(--f-text-xs);
		color: var(--f-text);
	}

	.f-ctrl-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.f-ctrl-select {
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-sm);
		background: var(--f-surface);
		color: var(--f-text);
		font-family: inherit;
		outline: none;
	}

	.f-ctrl-toggle {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
		user-select: none;
	}

	.f-motion-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		padding: 1.5rem 0;
	}

	.f-demo-card-inner {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 100%;
		box-sizing: border-box;
	}

	.f-demo-card-inner h4 {
		margin: 0;
		font-size: var(--f-text-lg);
		color: var(--f-text);
	}

	.f-demo-card-inner p {
		margin: 0;
		font-size: var(--f-text-xs);
		color: var(--f-text-muted);
		line-height: 1.5;
	}

	.f-scramble-box {
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-lg);
		background: var(--f-surface);
	}

	.f-marquee-wrapper {
		margin-top: 1.5rem;
		border-top: 1px solid var(--f-border-subtle);
		padding-top: 1rem;
	}

	.f-marquee-item {
		font-size: var(--f-text-sm);
		font-weight: 600;
		color: var(--f-text);
		margin: 0 1.5rem;
	}

	.f-flow-preview-canvas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 2.5rem 1.5rem;
		background: var(--f-sunken);
		border-radius: var(--f-radius-md);
	}

	.f-flow-connector {
		font-size: 1.5rem;
		color: var(--f-text-muted);
	}

	.f-token-swatches {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.f-swatch {
		padding: 0.75rem 1rem;
		border-radius: var(--f-radius-sm);
		font-family: var(--f-font-mono);
		font-size: var(--f-text-xs);
		font-weight: 600;
	}

	.f-border-swatch {
		border: 1px solid var(--f-border);
	}

	@media (max-width: 768px) {
		.f-hero-title {
			font-size: 2rem;
		}
		.f-forms-box {
			grid-template-columns: 1fr;
		}
	}
</style>
