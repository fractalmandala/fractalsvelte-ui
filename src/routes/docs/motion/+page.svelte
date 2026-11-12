<script lang="ts">
	import { animate, magnetic, press, springDuration, springs, tilt, type SpringPreset } from '@fractaldesign/fractalsvelte-ui/motion';
	import CodeBlock from '../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../docs-site/DocPage.svelte';
	import GuideFooter from '../../../docs-site/GuideFooter.svelte';
	import Rich from '../../../docs-site/Rich.svelte';
	import Section from '../../../docs-site/Section.svelte';

	const presets = Object.keys(springs) as SpringPreset[];
	const feel: Record<SpringPreset, string> = {
		gentle: 'Soft settle — panels, page content',
		snappy: 'The default — presses, toggles, menus',
		bouncy: 'A visible overshoot — playful confirmation',
		stiff: 'Nearly instant — dense UI, indicators',
		slow: 'Long and calm — hero motion, ambient'
	};

	let dots = $state<HTMLElement[]>([]);
	let out = $state(false);
	function run() {
		out = !out;
		dots.forEach((node, i) => {
			if (!node) return;
			const travel = (node.parentElement?.clientWidth ?? 320) - node.clientWidth;
			void animate(node, { x: out ? travel : 0 }, { spring: presets[i] });
		});
	}

	const attachments: [string, string][] = [
		['vars({ value })', 'Writes any custom properties — the bridge from state to CSS.'],
		['press()', 'Springs the scale down while pressed (pointer or Enter/Space).'],
		['hover()', 'A spring lift on hover or keyboard focus.'],
		['magnetic()', 'Pulls the element toward a nearby pointer; springs back.'],
		['tilt()', '3D tilt toward the pointer through --rx / --ry (class tilt).'],
		['pointer()', 'Tracks the pointer as --px / --py for spotlights and gradients.'],
		['inView()', 'Toggles a class (default in) when the element scrolls into view.'],
		['reveal()', 'Springs the element in from an offset when it enters the viewport.'],
		['stagger()', 'Numbers a container’s items with --i for staggered CSS motion.'],
		['drag()', 'Pointer dragging with bounds, momentum and snap-back.'],
		['parallax()', 'Scroll-linked offset written to --my (or --mx).'],
		['scrollProgress()', 'Writes scroll progress 0..1 to --value.'],
		['createFlip()', 'FLIP layout animation on springs for reordering lists.']
	];

	const engine = `<script lang="ts">
	import { animate, SpringValue, vars } from '@fractaldesign/fractalsvelte-ui/motion';

	let card: HTMLElement;
	const progress = new SpringValue(0, 'gentle');
</` + `script>

<!-- the element carries .motion: it reads --mx --my --ms --mr --mo -->
<div class="motion" bind:this={card}></div>
<button onclick={() => animate(card, { x: 120, scale: 1.05 }, { spring: 'bouncy' })}>Go</button>

<div class="track h-xs"><div class="fill" {@attach vars({ value: progress.current })}></div></div>
<button onclick={() => (progress.target = 1)}>Fill</button>`;

	const attach = `<script lang="ts">
	import { press, magnetic, tilt } from '@fractaldesign/fractalsvelte-ui/motion';
</` + `script>

<button class="motion" {@attach press()}>Press me</button>
<div class="motion" {@attach magnetic()}>Magnetic</div>
<div class="tilt motion" {@attach tilt()}>Tilt</div>`;

	const transitions = `<script lang="ts">
	import { springScale, springFly } from '@fractaldesign/fractalsvelte-ui/motion';
	let open = $state(false);
</` + `script>

{#if open}
	<div in:springScale={{ spring: 'bouncy' }} out:springFly={{ y: 8 }}>Saved</div>
{/if}`;

	const css = `<!-- state-driven motion: a spring timing function, no JavaScript -->
<div class="spring spring-bouncy {open ? 'open' : ''}">…</div>

<!-- anything that opens: popovers, dialogs, .open -->
<div popover class="pop enter-down">…</div>

<!-- staggered entrance -->
<li class="anim-in" {@attach vars({ i: index })}>…</li>`;

	const toc = [
		{ id: 'presets', label: 'Spring presets' },
		{ id: 'engine', label: 'The JS engine' },
		{ id: 'attachments', label: 'Attachments' },
		{ id: 'transitions', label: 'Transitions' },
		{ id: 'css', label: 'CSS spring tokens' },
		{ id: 'reduced', label: 'Reduced motion' }
	];
</script>

<DocPage
	title="Motion"
	eyebrow="Springs"
	lead="Everything a person moves or triggers rides a spring: an analytic solver for CSS easing, a frame-loop engine for gestures, and attachments that wire both to elements."
	{toc}
>
	<Section id="presets" title="Spring presets">
		<p class="text-body text-secondary lh16">
			<Rich text={"Five presets cover almost every case. Pass a name, or a partial `{ stiffness, damping, mass }` merged over `snappy`. Run them side by side:"} />
		</p>
		<div class="box gap-sm border radius-bs bg-surface pad-lg rim shad-sm">
			{#each presets as p, i (p)}
				<div class="box gap-xs">
					<span class="text-xs font-mono text-muted">{p}</span>
					<div class="relative wfull h-md radius-full bg-panel">
						<div class="motion h-md square radius-full themed" bind:this={dots[i]}></div>
					</div>
				</div>
			{/each}
			<div class="row xright pt-sm">
				<button type="button" class="button secondary h-bs px-md mincurved text-sm" onclick={run}>{out ? 'Back' : 'Run all five'}</button>
			</div>
		</div>
		<div class="scroll-x border radius-bs">
			<table class="data-table">
				<thead><tr><th scope="col">Preset</th><th scope="col">Stiffness</th><th scope="col">Damping</th><th scope="col">Settles</th><th scope="col">Feel</th></tr></thead>
				<tbody>
					{#each presets as p (p)}
						<tr>
							<td><code class="font-mono text-sm weight-500">{p}</code></td>
							<td class="tabular-nums text-sm">{springs[p].stiffness}</td>
							<td class="tabular-nums text-sm">{springs[p].damping}</td>
							<td class="tabular-nums text-sm">≈ {Math.round(springDuration(p))} ms</td>
							<td class="text-sm text-secondary">{feel[p]}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>

	<Section id="engine" title="The JS engine">
		<p class="text-body text-secondary lh16">
			<Rich text={"`animate(node, values, { spring })` springs an element's motion channels — `x`, `y`, `scale`, `rotate`, `opacity`, `rotateX`, `rotateY` or any `--custom` property — and returns `{ finished, stop() }`. A new call takes over mid-flight and keeps the velocity. The element carries the `motion` class, which turns the channels into `translate`, `scale`, `rotate` and `opacity`. `SpringValue` is the same spring as reactive state: set `target`, read `current`."} />
		</p>
		<CodeBlock code={engine} />
	</Section>

	<Section id="attachments" title="Attachments">
		<p class="text-body text-secondary lh16"><Rich text={"Attach behaviour with `{@attach …}`. Try these three:"} /></p>
		<div class="grid-3 gap-md">
			<div class="example-stage box xcenter ycenter border radius-bs pad-lg">
				<button type="button" class="button themed h-lg px-lg mincurved motion" {@attach press()}>press()</button>
			</div>
			<div class="example-stage box xcenter ycenter border radius-bs pad-lg">
				<span class="button outline h-lg px-lg round motion" {@attach magnetic()}>magnetic()</span>
			</div>
			<div class="example-stage box xcenter ycenter border radius-bs pad-lg">
				<div class="tilt motion box xcenter ycenter border radius-bs bg-surface rim shad-md pad-lg" {@attach tilt()}>
					<span class="text-sm weight-500">tilt()</span>
				</div>
			</div>
		</div>
		<CodeBlock code={attach} />
		<div class="scroll-x border radius-bs">
			<table class="data-table">
				<thead><tr><th scope="col">Attachment</th><th scope="col">What it does</th></tr></thead>
				<tbody>
					{#each attachments as [name, what] (name)}
						<tr><td><code class="font-mono text-sm weight-500">{name}</code></td><td class="text-sm text-secondary"><Rich text={what} /></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>

	<Section id="transitions" title="Transitions">
		<p class="text-body text-secondary lh16">
			<Rich text="`springFade`, `springFly`, `springScale`, `springBlur` and `springSlide` are Svelte transitions whose easing and duration come from a spring." />
		</p>
		<CodeBlock code={transitions} />
	</Section>

	<Section id="css" title="CSS spring tokens">
		<p class="text-body text-secondary lh16">
			<Rich text="`pnpm gen` samples each preset into a CSS `linear()` easing: `--spring-<preset>` and its duration `--spring-<preset>-ms`. The `spring` class transitions common properties on the current spring; `spring-gentle` … `spring-slow` pick one. `pop` + `enter-*` animate anything that opens, `anim-in` staggers by `--i`, and `lift` / `press` are pure-CSS interactions." />
		</p>
		<CodeBlock code={css} />
	</Section>

	<Section id="reduced" title="Reduced motion">
		<p class="text-body text-secondary lh16">
			<Rich text={"Every duration in the extension layer multiplies by `--motion-scale`, which drops to `0` under `prefers-reduced-motion` or `data-motion=\"off\"`. The JS engine and attachments check `reducedMotion.current` and jump to the end state. Components never need to handle it themselves."} />
		</p>
	</Section>

	{#snippet footer()}<GuideFooter href="/docs/motion" />{/snippet}
</DocPage>
