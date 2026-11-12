<!-- @example Tag and reveal :: A heading that morphs, using the reveal wipe from the control that opened it. -->
<script lang="ts">
	import { SharedElement, morph } from '@fractaldesign/fractalsvelte-ui';

	let expanded = $state(false);
</script>

<div class="box gap-md">
	{#if expanded}
		<SharedElement name="studio-title" as="h2" class="text-2xl weight-600">The Greenwich workshop</SharedElement>
		<p class="text-sm text-secondary">Unit 4, Holdsworth Street. Type, catalogues and wayfinding for cultural spaces.</p>
		<button class="button outline" onclick={(event) => morph(() => { expanded = false; }, { type: 'reveal', origin: event })}>Close</button>
	{:else}
		<button class="button secondary" onclick={(event) => morph(() => { expanded = true; }, { type: 'reveal', origin: event })}>
			<SharedElement name="studio-title" as="span" class="weight-500">The Greenwich workshop</SharedElement>
		</button>
	{/if}
</div>
