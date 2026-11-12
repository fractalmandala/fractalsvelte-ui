<!-- @example Appearance :: variant, size and shape, as on every other control. -->
<script lang="ts">
	import { CopyButton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		{#each ['primary', 'secondary', 'themed', 'soft', 'outline', 'ghost', 'link', 'info', 'success', 'warning', 'danger'] as v (v)}
			<CopyButton text={v} variant={v as never} label={`Copy ${v}`} />
		{/each}
	</div>
	<div class="row wrap gap-sm ycenter">
		{#each ['xs', 'sm', 'md', 'lg', 'xl'] as s (s)}
			<CopyButton text={s} variant="outline" size={s as never} label={`Copy ${s}`} />
		{/each}
	</div>
	<div class="row wrap gap-sm ycenter">
		{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as sh (sh)}
			<CopyButton text={sh} variant="outline" shape={sh as never} label={`Copy ${sh}`} />
		{/each}
	</div>
</div>
