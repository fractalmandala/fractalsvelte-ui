<!-- @example Constraints and locale :: min, max and isDateDisabled close days off; weekStartsOn, locale and onValueChange customise the grid. -->
<script lang="ts">
	import { Calendar } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>('2026-11-16');

	function isDateDisabled(iso: string) {
		const day = new Date(`${iso}T12:00:00`).getDay();
		return day === 0 || day === 6;
	}
</script>

<div class="box gap-sm measure-sm">
	<Calendar
		bind:value={date}
		min="2026-11-01"
		max="2026-12-15"
		{isDateDisabled}
		weekStartsOn={1}
		locale="de-DE"
		label="Lieferdatum"
		onValueChange={(v) => console.info('date', v)}
	/>
	<p class="text-sm text-muted">Weekends are closed · Woche beginnt montags</p>
</div>
