<!-- @example Usage :: A 16:9 frame holds a photograph; the media receives the fit class from the snippet. -->
<script lang="ts">
	import { AspectFrame } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="measure-sm">
	<AspectFrame ratio="16-9">
		{#snippet children(media)}
			<img class={media} src="https://picsum.photos/seed/fractalsvelte-studio/1200/675" alt="A walnut desk beside a window in morning light" />
		{/snippet}
	</AspectFrame>
</div>
