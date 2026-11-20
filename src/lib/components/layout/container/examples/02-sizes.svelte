<!-- @example Widths :: Every step of the measure ladder, plus full width. -->
<script lang="ts">
	import { Container } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<Container width="measure-xs" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">xs — the narrowest measure</span>
	</Container>
	<Container width="measure-sm" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">sm — a narrow reading column</span>
	</Container>
	<Container width="measure-md" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">md — articles and forms</span>
	</Container>
	<Container width="measure-lg" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">lg — the default page width</span>
	</Container>
	<Container width="measure-xl" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">xl — a wider workspace</span>
	</Container>
	<Container width="measure-2xl" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">2xl — dashboards and bento grids</span>
	</Container>
	<Container width="measure-3xl" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">3xl — a wide landing column</span>
	</Container>
	<Container width="measure-4xl" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">4xl — the widest measure</span>
	</Container>
	<Container width="measure-full" padded class="border-subtle radius-md bg-panel">
		<span class="text-sm weight-500">full — fills the parent</span>
	</Container>
</div>
