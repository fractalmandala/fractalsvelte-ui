<!-- @example Usage :: A bound input inside a Field. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';

	let name = $state('');
</script>

<div class="measure-sm box gap-sm">
	<Field label="Full name">
		<Input bind:value={name} placeholder="Ada Lovelace" autocomplete="name" />
	</Field>
	<p class="text-sm text-muted">{name ? `Hello, ${name}.` : 'Type your name above.'}</p>
</div>
