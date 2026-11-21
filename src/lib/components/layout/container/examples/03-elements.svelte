<!-- @example Elements :: The same container as each supported element, with and without centering. -->
<script lang="ts">
	import { Container } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<Container as="div" width="measure-md" class="border-subtle radius-md bg-panel pad-md">
		<span class="text-sm">div — a width constraint with no landmark role.</span>
	</Container>
	<Container as="section" width="measure-md" center class="border-subtle radius-md bg-panel pad-md">
		<span class="text-sm">section — a centred landmark for a chapter of the page.</span>
	</Container>
	<Container as="article" width="measure-md" padded pad="pad-sm" class="border-subtle radius-md bg-panel">
		<span class="text-sm">article — a self-contained note, with tight padding and no centering.</span>
	</Container>
	<Container as="main" width="measure-md" padded center class="border-subtle radius-md bg-panel">
		<span class="text-sm">main — the page's primary landmark, padded and centred.</span>
	</Container>
	<Container as="aside" width="measure-sm" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm">aside — a supporting column, such as a table of contents.</span>
	</Container>
</div>
