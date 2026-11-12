<!-- @example Look :: Size, shape and variant on the Field are inherited by the control inside, unless the control sets its own. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Field label="Workspace name" size="xs" shape="rect" variant="outline" hint="Extra-small, square, outline.">
		<Input placeholder="acme" />
	</Field>
	<Field label="Support inbox" size="sm" shape="mincurved" variant="filled" hint="Small, slightly rounded, filled.">
		<Input placeholder="hello@acme.com" />
	</Field>
	<Field label="Display name" size="md" shape="modern" variant="ghost" hint="Medium, modern, ghost.">
		<Input placeholder="Ada Lovelace" />
	</Field>
	<Field label="Company" size="lg" shape="curved" variant="outline" hint="Large, curved, outline.">
		<Input placeholder="Analytical Engines Ltd." />
	</Field>
	<Field label="Handle" size="xl" shape="round" variant="filled" hint="Extra-large, pill, filled.">
		<Input placeholder="ada-lovelace" />
	</Field>
</div>
