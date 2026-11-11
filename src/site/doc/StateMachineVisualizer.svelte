<script lang="ts">
	// Renders one StateMachineDef: the state graph, plus a player that walks a scenario's steps.
	import type { StateMachineDef, StateNode } from '$site/data/state-machines';

	interface Props {
		machine: StateMachineDef;
	}

	let { machine }: Props = $props();

	const uid = $props.id();

	// Node boxes are laid out in graph units and sized as a percentage of the graph,
	// so the whole diagram scales with its container instead of clipping.
	const NODE_W = 156;
	const NODE_H = 46;
	const PAD = 64;

	const bounds = $derived.by(() => {
		const xs = machine.nodes.map((n) => n.x);
		const ys = machine.nodes.map((n) => n.y);
		const minX = Math.min(...xs) - NODE_W / 2 - PAD;
		const maxX = Math.max(...xs) + NODE_W / 2 + PAD;
		const minY = Math.min(...ys) - NODE_H / 2 - PAD;
		const maxY = Math.max(...ys) + NODE_H / 2 + PAD;
		return { minX, minY, w: maxX - minX, h: maxY - minY };
	});

	const nodeById = $derived(new Map(machine.nodes.map((n) => [n.id, n])));

	const pos = (n: StateNode) => ({ x: n.x - bounds.minX, y: n.y - bounds.minY });
	const pct = (v: number, total: number) => `${(v / total) * 100}%`;

	interface Edge {
		id: string;
		from: string;
		to: string;
		event: string;
		d: string;
		labelX: number;
		labelY: number;
	}

	// Quadratic curve from one node's edge to the other's; curveOffset bows it so two
	// transitions between the same pair stay readable.
	const edges = $derived.by(() => {
		const out: Edge[] = [];
		for (const t of machine.transitions) {
			const a = nodeById.get(t.from);
			const b = nodeById.get(t.to);
			if (!a || !b) continue;

			const p0 = pos(a);
			const p2 = pos(b);
			const dx = p2.x - p0.x;
			const dy = p2.y - p0.y;
			const len = Math.hypot(dx, dy) || 1;
			const ux = dx / len;
			const uy = dy / len;
			const trim = Math.min(
				NODE_W / 2 / Math.max(Math.abs(ux), 1e-6),
				NODE_H / 2 / Math.max(Math.abs(uy), 1e-6)
			);
			const start = { x: p0.x + ux * trim, y: p0.y + uy * trim };
			const end = { x: p2.x - ux * trim, y: p2.y - uy * trim };
			const bow = t.curveOffset ?? 0;
			const cx = (start.x + end.x) / 2 - uy * bow;
			const cy = (start.y + end.y) / 2 + ux * bow;

			out.push({
				id: t.id,
				from: t.from,
				to: t.to,
				event: t.event,
				d: `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`,
				labelX: 0.25 * start.x + 0.5 * cx + 0.25 * end.x,
				labelY: 0.25 * start.y + 0.5 * cy + 0.25 * end.y
			});
		}
		return out;
	});

	let scenarioIndex = $state(0);
	let stepIndex = $state(-1);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const scenario = $derived(machine.scenarios[scenarioIndex]);
	const step = $derived(stepIndex >= 0 ? scenario?.steps[stepIndex] : undefined);
	const activeEdge = $derived(
		step ? (edges.find((e) => e.from === step.from && e.to === step.to)?.id ?? null) : null
	);
	const isActiveNode = (id: string) =>
		Boolean(step) && (step?.from === id || step?.to === id);

	function stop() {
		clearTimeout(timer);
		timer = undefined;
		stepIndex = -1;
	}

	function advance() {
		const steps = scenario?.steps ?? [];
		if (stepIndex + 1 >= steps.length) return;
		stepIndex += 1;
		timer = setTimeout(advance, steps[stepIndex].durationMs);
	}

	function play() {
		stop();
		advance();
	}

	function pick(index: number) {
		stop();
		scenarioIndex = index;
	}

	$effect(() => () => clearTimeout(timer));
</script>

<div class="machine">
	<div
		class="graph"
		style:aspect-ratio="{bounds.w} / {bounds.h}"
		role="img"
		aria-label="{machine.title}: {machine.nodes.length} states, {machine.transitions
			.length} transitions"
	>
		<svg viewBox="0 0 {bounds.w} {bounds.h}" aria-hidden="true">
			<defs>
				<marker
					id="arrow-{uid}"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="5"
					markerHeight="5"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
				</marker>
			</defs>
			{#each edges as edge (edge.id)}
				<path
					class={['edge', activeEdge === edge.id ? 'on' : undefined]}
					d={edge.d}
					marker-end="url(#arrow-{uid})"
				/>
			{/each}
		</svg>

		{#each edges as edge (edge.id)}
			<span
				class={['edge-label', activeEdge === edge.id ? 'on' : undefined]}
				style:left={pct(edge.labelX, bounds.w)}
				style:top={pct(edge.labelY, bounds.h)}>{edge.event}</span
			>
		{/each}

		{#each machine.nodes as node (node.id)}
			{@const p = pos(node)}
			<div
				class={['node', node.type ?? 'intermediate', isActiveNode(node.id) ? 'on' : undefined]}
				style:left={pct(p.x, bounds.w)}
				style:top={pct(p.y, bounds.h)}
				style:width={pct(NODE_W, bounds.w)}
				style:height={pct(NODE_H, bounds.h)}
				title={node.description}
			>
				<span>{node.label}</span>
			</div>
		{/each}
	</div>

	<p class="legend text-xs text-muted">
		<span><i class="swatch initial"></i>initial</span>
		<span><i class="swatch intermediate"></i>intermediate</span>
		<span><i class="swatch transient"></i>transient</span>
		<span><i class="swatch terminal"></i>terminal</span>
	</p>

	<div class="player">
		<div class="row gap-xs wrap">
			{#each machine.scenarios as s, i (s.name)}
				<button
					type="button"
					class={['scenario', i === scenarioIndex ? 'on' : undefined]}
					onclick={() => pick(i)}
				>
					{s.name}
				</button>
			{/each}
		</div>

		{#if scenario}
			<p class="text-sm text-secondary description">{scenario.description}</p>
		{/if}

		<div class="row gap-sm">
			<button type="button" class="control" onclick={play}>
				{stepIndex === -1 ? 'Play scenario' : 'Replay scenario'}
			</button>
			<button type="button" class="control ghost" onclick={stop} disabled={stepIndex === -1}>
				Reset
			</button>
		</div>

		{#if scenario}
			<ol class="steps">
				{#each scenario.steps as s, i (i)}
					<li class={i === stepIndex ? 'on' : undefined}>
						<span class="transition"><code>{s.from}</code> → <code>{s.to}</code></span>
						<span class="event">{s.event}</span>
						<span class="text-sm text-secondary note">{s.annotation}</span>
					</li>
				{/each}
			</ol>
		{/if}

		<p class="live" aria-live="polite">
			{step ? step.annotation : 'Pick a scenario, then play it to see each state change.'}
		</p>
	</div>
</div>

<style>
	.machine {
		display: grid;
		gap: var(--space-md);
	}

	.graph {
		position: relative;
		inline-size: 100%;
		max-inline-size: 54rem;
		margin-inline: auto;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		background: var(--bg-surface);
		color: var(--text-muted);
	}

	.graph svg {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		overflow: visible;
	}

	.edge {
		fill: none;
		stroke: var(--border-strong);
		stroke-width: 1.25;
		transition: stroke 120ms ease;
	}

	.edge.on {
		stroke: var(--theme-color);
		stroke-width: 2.5;
	}

	.edge-label {
		position: absolute;
		transform: translate(-50%, -50%);
		padding: 0 0.3em;
		border-radius: var(--radius-xs);
		background: var(--bg-surface);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		white-space: nowrap;
		pointer-events: none;
	}

	.edge-label.on {
		color: var(--theme-color);
	}

	.node {
		position: absolute;
		display: grid;
		place-items: center;
		transform: translate(-50%, -50%);
		padding-inline: 0.4rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-panel);
		color: var(--text-primary);
		font-size: 0.68rem;
		line-height: 1.15;
		text-align: center;
		transition:
			border-color 120ms ease,
			background 120ms ease;
	}

	.node span {
		overflow: hidden;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.node.initial {
		border-color: var(--border-strong);
	}

	.node.terminal {
		border-style: double;
		border-width: 3px;
	}

	.node.transient {
		border-style: dashed;
	}

	.node.on {
		border-color: var(--theme-color);
		background: var(--state-selected);
		box-shadow: 0 0 0 2px var(--theme-color);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		margin: 0;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		display: inline-block;
		inline-size: 0.85rem;
		block-size: 0.6rem;
		border: 1px solid var(--border-strong);
		border-radius: 2px;
		background: var(--bg-panel);
	}

	.swatch.terminal {
		border-style: double;
		border-width: 3px;
	}

	.swatch.transient {
		border-style: dashed;
	}

	.player {
		display: grid;
		gap: var(--space-sm);
	}

	.scenario,
	.control {
		padding: 0.35rem 0.7rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-button);
		color: var(--text-primary);
		font: inherit;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.scenario:hover,
	.control:hover {
		background: var(--bg-button-hover);
	}

	.scenario.on {
		border-color: var(--theme-color);
		color: var(--theme-color);
	}

	.control.ghost {
		background: none;
	}

	.control:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.description {
		margin: 0;
	}

	.steps {
		display: grid;
		gap: 0.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.steps li {
		display: grid;
		grid-template-columns: minmax(9rem, auto) minmax(7rem, auto) 1fr;
		gap: var(--space-sm);
		align-items: baseline;
		padding: 0.3rem 0.5rem;
		border-inline-start: 2px solid transparent;
		border-radius: var(--radius-xs);
	}

	.steps li.on {
		border-inline-start-color: var(--theme-color);
		background: var(--state-selected);
	}

	.transition code {
		font-size: 0.72rem;
	}

	.event {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}

	.note {
		grid-column: 3;
	}

	.live {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	@media (max-width: 40rem) {
		.steps li {
			grid-template-columns: 1fr;
		}

		.note {
			grid-column: 1;
		}
	}
</style>
