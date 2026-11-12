<!-- @example Sizes :: Every step of the measure ladder, plus full width. -->
<script lang="ts">
	import { Container } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<Container size="sm" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">sm — a narrow reading column</span>
	</Container>
	<Container size="md" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">md — articles and forms</span>
	</Container>
	<Container size="lg" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">lg — the default page width</span>
	</Container>
	<Container size="xl" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">xl — a wider workspace</span>
	</Container>
	<Container size="2xl" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">2xl — dashboards and bento grids</span>
	</Container>
	<Container size="full" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">full — fills the parent</span>
	</Container>
</div>
