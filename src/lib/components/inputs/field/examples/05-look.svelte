<!-- @example Look :: Size, shape and look on the Field are inherited by the control inside, unless the control sets its own. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Field label="Workspace name" size="h-xs" shape="rect" look="outline" hint="Extra-small, square, outline.">
		<Input placeholder="acme" />
	</Field>
	<Field label="Support inbox" size="h-sm" shape="mincurved" look="filled" hint="Small, slightly rounded, filled.">
		<Input placeholder="hello@acme.com" />
	</Field>
	<Field label="Display name" size="h-md" shape="modern" look="ghost" hint="Medium, modern, ghost.">
		<Input placeholder="Ada Lovelace" />
	</Field>
	<Field label="Company" size="h-lg" shape="curved" look="outline" hint="Large, curved, outline.">
		<Input placeholder="Analytical Engines Ltd." />
	</Field>
	<Field label="Handle" size="h-xl" shape="round" look="filled" hint="Extra-large, pill, filled.">
		<Input placeholder="ada-lovelace" />
	</Field>
	<Field label="Seat count" size="h-bs" shape="mincurved" look="outline" hint="Base, slightly rounded, outline.">
		<Input placeholder="12" />
	</Field>
	<Field label="Description" size="h-2xl" shape="curved" look="filled" hint="2× large, curved, filled.">
		<Input placeholder="Analytical engines, since 1843." />
	</Field>
	<Field label="Notes" size="h-3xl" shape="round" look="ghost" hint="3× large, pill, ghost.">
		<Input placeholder="No notes yet." />
	</Field>
</div>
