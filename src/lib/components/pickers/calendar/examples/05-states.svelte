<!-- @example Disabled and type :: A calendar that cannot be changed, and one whose title, weekday headings and arrows follow its own scale and corner. -->
<script lang="ts">
	import { Calendar } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Calendar value="2026-11-12" disabled label="Locked booking" />
	<Calendar
		value="2026-11-12"
		size="h-md"
		shape="modern"
		textSize="text-lg"
		childTextSize="text-sm"
		childTextColor="text-secondary"
		gap="gap-md"
		label="Editorial date, small arrows"
	/>
</div>
