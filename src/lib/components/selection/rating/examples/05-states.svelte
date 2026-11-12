<!-- @example States and forms :: readonly shows a score, disabled locks it, and name submits with a form; onValueChange reports each change. -->
<script lang="ts">
	import { Rating } from '@fractaldesign/fractalsvelte-ui';

	let score = $state(5);
	let submitted = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('quality') ?? '');
	}
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<p class="text-sm text-secondary">Average review (readonly)</p>
		<Rating value={4.5} allowHalf readonly label="Average review" />
	</div>
	<div class="box gap-xs">
		<p class="text-sm text-secondary">Archived product (disabled)</p>
		<Rating value={2} disabled label="Archived product" />
	</div>
	<form class="box gap-sm" onsubmit={submit}>
		<Rating
			bind:value={score}
			name="quality"
			label="Print quality"
			onValueChange={(v) => console.info('quality', v)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Submit review</button>
			<span class="text-sm text-muted">{submitted ? `Submitted quality=${submitted}` : `${score} selected`}</span>
		</div>
	</form>
</div>
