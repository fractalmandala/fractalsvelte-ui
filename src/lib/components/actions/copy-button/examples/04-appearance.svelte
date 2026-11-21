<!-- @example Appearance :: variant, size, shape and the confirming ink, as on every other control. -->
<script lang="ts">
	import { CopyButton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		{#each ['primary', 'secondary', 'themed', 'outline', 'ghost', 'link', 'info', 'success', 'warning', 'danger', 'neutral'] as v (v)}
			<CopyButton text={v} variant={v as never} label={`Copy ${v}`} />
		{/each}
		<CopyButton text="Retired" variant="outline" disabled />
		<CopyButton text="themed-check" variant="themed" childTextColor="text-inverse" label="Copy themed value" />
	</div>
	<div class="row wrap gap-sm ycenter">
		{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as s (s)}
			<CopyButton text={s} variant="primary" size={s as never} label={`Copy ${s}`} />
		{/each}
	</div>
	<div class="row wrap gap-sm ycenter">
		{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as sh (sh)}
			<CopyButton text={sh} variant="outline" shape={sh as never} label={`Copy ${sh}`} />
		{/each}
	</div>
</div>
