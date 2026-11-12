<!-- @example Loop and cursor :: A single pass that leaves the last word, and a line with no caret. -->
<script lang="ts">
	import { Typewriter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<p class="text-lg">
		<span class="text-muted">loop off — </span>
		<Typewriter words={['Gather', 'Set', 'Print']} loop={false} />
	</p>
	<p class="text-lg">
		<span class="text-muted">cursor off — </span>
		<Typewriter words={['serifs', 'italics', 'small caps']} cursor={false} />
	</p>
</div>
