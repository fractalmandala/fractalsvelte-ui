<!-- @example Max and validate :: At most five skills, each at least two characters, reported through onValueChange. -->
<script lang="ts">
	import { Field, TagsInput } from '@fractaldesign/fractalsvelte-ui';

	let skills = $state(['Svelte', 'TypeScript']);
	let changes = $state(0);

	function validate(tag: string): boolean | string {
		if (tag.length < 2) return 'Use at least two characters.';
		if (/\s{2,}/.test(tag)) return 'Use a single space between words.';
		return true;
	}
</script>

<div class="measure-sm">
	<Field label="Skills" hint="Up to five. Short fragments are rejected.">
		<TagsInput bind:value={skills} max={5} {validate} onValueChange={() => changes++} placeholder="Add a skill" />
	</Field>
</div>
