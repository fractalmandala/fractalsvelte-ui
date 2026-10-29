<script lang="ts">
	import { CenterMorphModal, Button } from '$lib/styler';
</script>

<CenterMorphModal triggerLabel="What's new" title="What's new in 2.0" description="Released October 2026">
	{#snippet children()}
		<div class="box gap-sm">
			<p>Every component now shares one set of props for variant, size, shape and shadow, so a form, a card and a dialog line up without custom CSS.</p>
			<p class="text-secondary">Dark mode, keyboard shortcuts and the new command palette ship in the same release.</p>
		</div>
	{/snippet}
	{#snippet footer({ close })}
		<Button variant="ghost" onclick={close}>Later</Button>
		<Button onclick={close}>Read the changelog</Button>
	{/snippet}
</CenterMorphModal>
