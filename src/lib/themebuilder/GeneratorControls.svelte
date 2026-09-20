<script lang="ts">
	import { studioState } from './studio.svelte.js';
	import { COLOURWAY_PRESETS, type ColourwayPreset } from './colourways.js';
	import { ARRANGEMENT_PRESETS, type ArrangementPreset } from './arrangements.js';
	import ColourwayWheel from './ColourwayWheel.svelte';
	import SilhouetteGrid from './SilhouetteGrid.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const categories = [
		{ id: 'fields', label: 'Fields', engines: ['flow', 'sky', 'aurora', 'mesh', 'still', 'retro', 'ios'] },
		{ id: 'stripes', label: 'Stripes', engines: ['linear', 'stripes', 'bars', 'columns', 'prism', 'waves', 'lines'] },
		{ id: 'objects', label: 'Objects', engines: ['rings', 'pixel', 'blocks', 'beehive', 'balls', 'radial', 'conic'] },
		{ id: 'forms', label: 'Forms (24)', engines: ['forms'] }
	] as const;

	function selectEngine(category: 'fields' | 'stripes' | 'objects' | 'forms', engine: string) {
		studioState.setEngine(engine, category);
	}

	const activeArrangements = $derived.by(() => {
		return ARRANGEMENT_PRESETS.filter(a => a.engineType === studioState.recipe.engineType);
	});

	function getParam(key: string, fallback: number): number {
		const val = studioState.recipe.parameters[key];
		return typeof val === 'number' ? val : Number(val ?? fallback);
	}
</script>

<div class="box gap-md {className}">
	<!-- 1. Generator Paradigm / Category -->
	<div class="box gap-2xs">
		<span class="eyebrow">Category</span>
		<div class="row wrap gap-2xs">
			{#each categories as cat}
				<button
					type="button"
					class="small"
					data-shape="modern"
					data-variant={studioState.activeCategory === cat.id ? 'active' : undefined}
					onclick={() => {
						selectEngine(cat.id as any, cat.engines[0]);
					}}
				>
					{cat.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- 2. Engine Algorithms in Selected Category -->
	{#if studioState.activeCategory !== 'forms'}
		<div class="box gap-2xs">
			<span class="eyebrow">Engine Type</span>
			<div class="row wrap gap-2xs">
				{#each (categories.find(c => c.id === studioState.activeCategory)?.engines || []) as eng}
					<button
						type="button"
						class="small"
						data-shape="modern"
						data-variant={studioState.recipe.engineType === eng ? 'active' : undefined}
						onclick={() => selectEngine(studioState.activeCategory as any, eng)}
					>
						{eng.toUpperCase()}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 3. 24 SVG Silhouette Forms Grid (when Forms category active) -->
	{#if studioState.recipe.engineType === 'forms' || studioState.activeCategory === 'forms'}
		<div class="box gap-2xs">
			<span class="eyebrow">Silhouettes (from SVG Set)</span>
			<SilhouetteGrid
				selectedId={studioState.recipe.activeSilhouette}
				onSelect={(shape) => studioState.selectSilhouette(shape.id)}
			/>
		</div>
	{/if}

	<!-- 4. Arrangement Presets (if available for engine) -->
	{#if activeArrangements.length > 0}
		<div class="box gap-2xs">
			<span class="eyebrow">Arrangements</span>
			<div class="row wrap gap-2xs">
				{#each activeArrangements as arr (arr.id)}
					<button
						type="button"
						class="small"
						data-shape="modern"
						data-variant={studioState.recipe.activeArrangement === arr.id ? 'active' : undefined}
						onclick={() => studioState.selectArrangement(arr)}
					>
						{arr.name}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 5. 12 Preset Colourway Pie Wheels -->
	<div class="box gap-2xs">
		<div class="row xbetween ycenter">
			<span class="eyebrow">Colourways</span>
			<span class="badge" data-variant="accent">{COLOURWAY_PRESETS.length}</span>
		</div>
		<div class="grid-4 stay2 gap-xs">
			{#each COLOURWAY_PRESETS as cw (cw.id)}
				<ColourwayWheel
					colourway={cw}
					active={studioState.recipe.activeColourway === cw.id}
					onSelect={(c) => studioState.selectColourway(c)}
				/>
			{/each}
		</div>
	</div>

	<!-- 6. Engine-Specific Parameter Sliders -->
	<div class="box gap-xs">
		<span class="eyebrow">Engine Parameters</span>

		{#if studioState.recipe.engineType === 'flow' || studioState.recipe.engineType === 'mesh'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Scale</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('scale', 50)}%</span>
				</div>
				<input
					type="range"
					min="10"
					max="100"
					class="slider"
					style="--fs-slider-pct: {((getParam('scale', 50) - 10) / 90) * 100}%"
					bind:value={studioState.recipe.parameters.scale}
				/>
			</div>
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Distortion</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('distortion', 40)}%</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					class="slider"
					style="--fs-slider-pct: {getParam('distortion', 40)}%"
					bind:value={studioState.recipe.parameters.distortion}
				/>
			</div>
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Swirl</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('swirl', 10)}%</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					class="slider"
					style="--fs-slider-pct: {getParam('swirl', 10)}%"
					bind:value={studioState.recipe.parameters.swirl}
				/>
			</div>
		{/if}

		{#if studioState.recipe.engineType === 'sky'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Elevation</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('elevation', 30)}°</span>
				</div>
				<input
					type="range"
					min="0"
					max="90"
					class="slider"
					style="--fs-slider-pct: {(getParam('elevation', 30) / 90) * 100}%"
					bind:value={studioState.recipe.parameters.elevation}
				/>
			</div>
		{/if}

		{#if studioState.recipe.engineType === 'aurora'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Lights Intensity</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('lights', 50)}%</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					class="slider"
					style="--fs-slider-pct: {getParam('lights', 50)}%"
					bind:value={studioState.recipe.parameters.lights}
				/>
			</div>
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Fold</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('fold', 50)}%</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					class="slider"
					style="--fs-slider-pct: {getParam('fold', 50)}%"
					bind:value={studioState.recipe.parameters.fold}
				/>
			</div>
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Spread</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('spread', 60)}%</span>
				</div>
				<input
					type="range"
					min="10"
					max="100"
					class="slider"
					style="--fs-slider-pct: {((getParam('spread', 60) - 10) / 90) * 100}%"
					bind:value={studioState.recipe.parameters.spread}
				/>
			</div>
		{/if}

		{#if studioState.recipe.engineType === 'bars' || studioState.recipe.engineType === 'stripes' || studioState.recipe.engineType === 'columns'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Count</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('count', 24)}</span>
				</div>
				<input
					type="range"
					min="4"
					max="64"
					class="slider"
					style="--fs-slider-pct: {((getParam('count', 24) - 4) / 60) * 100}%"
					bind:value={studioState.recipe.parameters.count}
				/>
			</div>
		{/if}

		{#if studioState.recipe.engineType === 'lines'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Thickness</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('thickness', 24)}px</span>
				</div>
				<input
					type="range"
					min="6"
					max="64"
					class="slider"
					style="--fs-slider-pct: {((getParam('thickness', 24) - 6) / 58) * 100}%"
					bind:value={studioState.recipe.parameters.thickness}
				/>
			</div>
		{/if}

		{#if studioState.recipe.engineType === 'beehive' || studioState.recipe.engineType === 'blocks' || studioState.recipe.engineType === 'pixel'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Cell Size</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('cellSize', 40)}px</span>
				</div>
				<input
					type="range"
					min="16"
					max="80"
					class="slider"
					style="--fs-slider-pct: {((getParam('cellSize', 40) - 16) / 64) * 100}%"
					bind:value={studioState.recipe.parameters.cellSize}
				/>
			</div>
		{/if}

		{#if studioState.recipe.engineType === 'linear' || studioState.recipe.engineType === 'conic'}
			<div class="box gap-3xs">
				<div class="row xbetween ycenter">
					<span class="text-xs weight-500 text-secondary">Angle</span>
					<span class="text-xs weight-600 mono text-primary">{getParam('angle', 45)}°</span>
				</div>
				<input
					type="range"
					min="0"
					max="360"
					class="slider"
					style="--fs-slider-pct: {(getParam('angle', 45) / 360) * 100}%"
					bind:value={studioState.recipe.parameters.angle}
				/>
			</div>
		{/if}
	</div>

	<!-- 7. Active Swatches / Color Spots -->
	<div class="box gap-xs">
		<div class="row xbetween ycenter">
			<div class="row gap-2xs ycenter">
				<span class="eyebrow">Color Spots</span>
				<span class="badge" data-variant="accent">{studioState.recipe.pins.length}</span>
			</div>
			<div class="row gap-2xs ycenter">
				<button
					type="button"
					class="small gap-3xs"
					data-shape="modern"
					onclick={() => studioState.shuffleColors()}
					title="Randomly shuffle spot colors"
				>
					🎲 Shuffle
				</button>
				<button
					type="button"
					class="small gap-3xs"
					data-shape="modern"
					onclick={() => studioState.addPin()}
					title="Add a new color spot"
				>
					+ Add
				</button>
			</div>
		</div>

		<div class="grid-2 gap-2xs">
			{#each studioState.recipe.pins as pin (pin.id)}
				<div class="row xbetween ycenter pad-2xs radius-sm border surface">
					<div class="row gap-xs ycenter">
						<label
							class="relative square-24 radius-sm border shrink-0"
							style="background-color: {pin.color}; cursor: pointer; overflow: hidden;"
							title="Click to change color"
						>
							<input
								type="color"
								value={pin.color}
								class="absolute full"
								style="opacity: 0; cursor: pointer; inset: 0; width: 100%; height: 100%; padding: 0; border: 0;"
								oninput={(e) => studioState.updatePin(pin.id, { color: e.currentTarget.value })}
							/>
						</label>
						<span class="text-xs weight-600 mono text-primary">{pin.color.toUpperCase()}</span>
					</div>
					<button
						type="button"
						class="small is-icon text-muted"
						style="width: 22px; height: 22px;"
						disabled={studioState.recipe.pins.length <= 2}
						onclick={() => studioState.removePin(pin.id)}
						title="Remove color spot"
					>
						✕
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- 8. Finish & Texture -->
	<div class="box gap-xs">
		<span class="eyebrow">Finish & Texture</span>
		<div class="grid-2 gap-xs">
		<div class="box gap-3xs">
			<div class="row xbetween ycenter">
				<span class="text-xs weight-500 text-secondary">Soften (Blur)</span>
				<span class="text-xs weight-600 mono text-primary">{studioState.recipe.soften}px</span>
			</div>
			<input
				type="range"
				min="0"
				max="60"
				class="slider"
				style="--fs-slider-pct: {(studioState.recipe.soften / 60) * 100}%"
				bind:value={studioState.recipe.soften}
			/>
		</div>
		<div class="box gap-3xs">
			<div class="row xbetween ycenter">
				<span class="text-xs weight-500 text-secondary">Noise (Grain)</span>
				<span class="text-xs weight-600 mono text-primary">{studioState.recipe.noise}%</span>
			</div>
			<input
				type="range"
				min="0"
				max="20"
				class="slider"
				style="--fs-slider-pct: {(studioState.recipe.noise / 20) * 100}%"
				bind:value={studioState.recipe.noise}
			/>
		</div>
		</div>
	</div>
</div>
