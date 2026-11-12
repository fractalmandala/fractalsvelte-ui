<!-- @example Speeds :: A slower typist, and a faster one that deletes more quickly. -->
<script lang="ts">
	import { Typewriter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<p class="text-lg">
		<span class="text-muted">speed 40, pause 2200 — </span>
		<Typewriter words={['Northwind', 'Fjord Line', 'Harbor & Co.']} speed={40} deleteSpeed={30} pause={2200} />
	</p>
	<p class="text-lg">
		<span class="text-muted">speed 110, deleteSpeed 25 — </span>
		<Typewriter words={['drafting', 'reviewing', 'typesetting']} speed={110} deleteSpeed={25} pause={900} />
	</p>
</div>
