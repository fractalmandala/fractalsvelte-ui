<!-- @example Split by :: The same line, revealed by character, by word and by line. -->
<script lang="ts">
	import { TextReveal } from '@fractaldesign/fractalsvelte-ui';

	const line = 'Ships Thursday from the Greenwich workshop.';
	const address = 'The Greenwich workshop\nUnit 4, Holdsworth Street\nLondon SE10 9EU';
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<p class="text-xs text-muted">by: char</p>
		<TextReveal by="char" step={28} text={line} />
	</div>
	<div class="box gap-xs">
		<p class="text-xs text-muted">by: word</p>
		<TextReveal by="word" text={line} />
	</div>
	<div class="box gap-xs">
		<p class="text-xs text-muted">by: line</p>
		<TextReveal by="line" as="div" class="text-sm text-secondary" text={address} />
	</div>
</div>
