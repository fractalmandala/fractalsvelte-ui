<script lang="ts">
	import { onMount } from 'svelte';
	import { studioState } from './studio.svelte.js';
	import { themeState } from './theme.svelte.js';
	import GradientCanvas from './GradientCanvas.svelte';
	import GeneratorControls from './GeneratorControls.svelte';
	import GalleryView from './GalleryView.svelte';
	import PaletteCatalog from './PaletteCatalog.svelte';
	import SavedView from './SavedView.svelte';
	import PaletteGenerator from './PaletteGenerator.svelte';
	import ExportModal from './ExportModal.svelte';
	import Save from '#lib/icons/save.svelte';
	import Share from '#lib/icons/share.svelte';
	import Preview from '#lib/icons/preview.svelte';
	import Use from '#lib/icons/use.svelte';
	import Export from '#lib/icons/export.svelte';
	import Close from '#lib/icons/close.svelte';
	import './studio.sass'

	interface Props {
		open?: boolean;
		onClose?: () => void;
	}

	let { open = true, onClose }: Props = $props();

	let showExportModal = $state(false);
	let toastMessage = $state<string | null>(null);
	let toastTimeout: any;

	function showToast(msg: string) {
		toastMessage = msg;
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastMessage = null;
		}, 2500);
	}

	function close() {
		if (onClose) {
			onClose();
		}
	}

	function handleSave() {
		const result = studioState.saveCurrentRecipe();
		showToast(
			result.status === 'updated' ? `Updated "${result.title}"!` : `Saved "${result.title}"!`
		);
	}

	function applyAsActiveTheme() {
		const recipe = studioState.recipe;
		const pins = recipe.pins;
		const brandColor = pins[0]?.color || '#00B4D8';
		const secondaryColor = pins[1]?.color || '#7209B7';
		const isDark = themeState.isDark;

		const tokens: Record<string, string> = {
			'theme-color': brandColor,
			'theme-color-alt': secondaryColor,
			bg: isDark ? '#0F172A' : '#FFFFFF',
			'bg-surface': isDark ? '#1E293B' : '#F8FAFC',
			'bg-raised': isDark ? '#334155' : '#F1F5F9',
			border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
			'text-primary': isDark ? '#F8FAFC' : '#0F172A',
			'text-secondary': isDark ? '#94A3B8' : '#64748B',
			'text-muted': isDark ? '#64748B' : '#94A3B8'
		};

		themeState.saveCustomTheme({
			name: recipe.title || 'Studio Blend',
			mode: isDark ? 'dark' : 'light',
			tokens,
			aura: {
				id: `blend-${Date.now()}`,
				name: recipe.title,
				description: `Atmospheric blend from ${recipe.engineType.toUpperCase()}`,
				layers: pins.map((p, idx) => ({
					background: `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color}, transparent 70%)`,
					color: p.color,
					size: p.radius * 6,
					x: p.x,
					y: p.y,
					opacity: 0.8,
					blur: Math.max(30, recipe.soften * 2),
					blendMode: 'normal' as const,
					animDuration: 18 + idx * 4,
					animDelay: idx * 2
				}))
			}
		});

		showToast(`Theme "${recipe.title}" created & applied!`);
	}

	function share() {
		const json = JSON.stringify(studioState.recipe);
		const base64 = btoa(encodeURIComponent(json));
		if (typeof window !== 'undefined') {
			const url = `${window.location.origin}${window.location.pathname}#gradient=${base64}`;
			navigator.clipboard.writeText(url);
			showToast('Link copied to clipboard!');
		}
	}

	onMount(() => {
		studioState.init();
	});
</script>

{#if open}
	<section class="studio-container">
	<!-- Top Studio Header -->
	<aside class="widebar box gap-sm">
		<!-- Top Toast Banner -->
		{#if toastMessage}
			<div class="alert" data-variant="success" role="status">
				<div class="row ycenter gap-xs">
					<span class="alert-icon">✓</span>
					<span class="text-xs weight-500 text-primary">{toastMessage}</span>
				</div>
			</div>
		{/if}
		<!-- 5 Primary Navigation Tabs -->
		<nav class="row wrap gap-2xs bb pb-sm" aria-label="Studio views">
			<button
				type="button"
				class="ghost h24"
				data-shape="modern"
				data-variant={studioState.activeView === 'studio' ? 'active' : undefined}
				onclick={() => (studioState.activeView = 'studio')}
			>
				Studio
			</button>
			<button
				type="button"
				class="ghost h24"
				data-shape="modern"
				data-variant={studioState.activeView === 'gallery' ? 'active' : undefined}
				onclick={() => (studioState.activeView = 'gallery')}
			>
				Gallery ({studioState.galleryPresets.length})
			</button>
		</nav>
		<!-- Fixed Studio Action Controls (Top Header Area) -->
		{#if studioState.activeView === 'studio'}
			<div class="box gap-xs bb pb-sm">
				<div class="row xbetween ycenter">
					<div class="row gap-xs ycenter min0">
						<span class="text-xs weight-500 text-muted">Recipe</span>
						<span class="text-sm weight-600 text-primary truncate">{studioState.recipe.title}</span>
					</div>
					<span class="badge" data-variant="accent">{studioState.recipe.engineType.toUpperCase()}</span>
				</div>
				<div class="row wrap gap-2xs ycenter" role="toolbar" aria-label="Studio actions">
					<button type="button" class="small gap-2xs" data-shape="modern" onclick={handleSave} title="Save current recipe">
						<Save />
						<span>Save</span>
					</button>
					<button type="button" class="small gap-2xs" data-shape="modern" onclick={share} title="Share recipe link">
						<Share />
						<span>Share</span>
					</button>
					<button
						type="button"
						class="small gap-2xs"
						data-shape="modern"
						data-variant={studioState.previewMode ? 'active' : undefined}
						onclick={() => (studioState.previewMode = !studioState.previewMode)}
						title="Toggle preview mode"
					>
						<Preview />
						<span>Preview</span>
					</button>
					<button
						type="button"
						class="small gap-2xs"
						data-shape="modern"
						onclick={applyAsActiveTheme}
						title="Save and apply as custom theme"
					>
						<Use />
						<span>Use</span>
					</button>
					<button
						type="button"
						class="small gap-2xs"
						data-shape="modern"
						onclick={() => (showExportModal = true)}
						title="Export theme code"
					>
						<Export />
						<span>Export</span>
					</button>
					<button
						type="button"
						class="small ml-auto"
						data-shape="modern"
						onclick={close}
						title="Close Studio"
					>
						<Close />
					</button>
				</div>
			</div>
			<GeneratorControls />
		{:else if studioState.activeView === 'gallery'}
			<GalleryView />
		{/if}
	</aside>
	<!-- Main Studio View Body -->
	<section class="studio-main">
		{#if studioState.activeView === 'studio' || studioState.activeView === 'gallery'}
			<div class="studio-workbench">
				<div class="studio-canvas-container">
					<GradientCanvas />
				</div>
			</div>
		{:else if studioState.activeView === 'palette'}
			<PaletteCatalog />
		{:else if studioState.activeView === 'palette-gen'}
			<div style="flex: 1; padding: 24px; overflow-y: auto;">
				<PaletteGenerator />
			</div>
		{:else if studioState.activeView === 'saved'}
			<SavedView />
		{/if}
	</section>

	<!-- Export Dialog -->
	{#if showExportModal}
		<aside class="sidebar-right">
			<ExportModal onClose={() => (showExportModal = false)} />
		</aside>
	{/if}
	</section>
{/if}
