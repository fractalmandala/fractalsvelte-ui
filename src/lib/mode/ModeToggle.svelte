<script lang="ts">
	import { mode } from './mode.svelte.js';
	import Sun from './Sun.svelte';
	import Moon from './Moon.svelte';

	let { class: className = '' }: { class?: string } = $props();

	// The one mode engine. toggle() defaults to the swipe — the incoming theme
	// wipes over the old one (dark falls from the top, light rises from the
	// bottom, 520ms), and falls back to an instant flip under reduced motion or
	// where view transitions are missing.
	const store = mode();
	const dark = $derived(store.resolved === 'dark');
</script>

<div
	class="row modeToggle {className}"
	class:ondark={dark}
	role="radiogroup"
	aria-label="Theme mode"
>
	<button
		type="button"
		class="is-icon"
		class:active={!dark}
		role="radio"
		aria-checked={!dark}
		aria-label="Light Mode"
		title="Light Mode"
		onclick={() => store.setLight()}
	>
		<Sun />
	</button>
	<button
		type="button"
		class="is-icon"
		class:active={dark}
		role="radio"
		aria-checked={dark}
		aria-label="Dark Mode"
		title="Dark Mode"
		onclick={() => store.setDark()}
	>
		<Moon />
	</button>
</div>

<style lang="sass">

.modeToggle
	position: relative
	display: inline-flex
	align-items: center
	gap: 2px
	padding: 2px
	height: 28px
	background: var(--bg-raised)
	border: 1px solid var(--border)
	border-radius: var(--radius-full)
	button
		position: relative
		z-index: 1
		display: inline-flex
		align-items: center
		justify-content: center
		width: 22px
		height: 22px
		padding: 0
		border: none
		border-radius: var(--radius-full)
		background: transparent
		color: var(--text-muted)
		cursor: pointer
		transition: background var(--motion-fast) ease, color var(--motion-fast) ease, box-shadow var(--motion-fast) ease
		&:hover:not(.active)
			color: var(--text-primary)
		&:focus-visible
			outline: 2px solid var(--ring)
			outline-offset: 1px
		&.active
			background: var(--bg-sunken)
			color: var(--text-primary)
			box-shadow: var(--shadow-sm)
			cursor: default

</style>
