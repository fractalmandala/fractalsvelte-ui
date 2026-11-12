<!-- @example Presets and formats :: presets add quick picks; format switches short, medium and long display, and clearable resets the field. -->
<script lang="ts">
	import { DatePicker, formatIso } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>('2026-11-12');
	const presets = [
		{ label: 'Today', value: '2026-11-12' },
		{ label: 'Next week', value: '2026-11-19' },
		{ label: 'End of month', value: '2026-11-30' }
	];
</script>

<div class="box gap-md measure-xs">
	<DatePicker bind:value={date} {presets} format="medium" clearable placeholder="Invoice due" aria-label="Invoice due" />
	<DatePicker value={date} format="short" placeholder="Short" aria-label="Short format" />
	<DatePicker value={date} format="long" placeholder="Long" aria-label="Long format" />
	<p class="text-sm text-muted">{date ? `Due ${formatIso(date, undefined, 'long')}` : 'No due date'}</p>
</div>
