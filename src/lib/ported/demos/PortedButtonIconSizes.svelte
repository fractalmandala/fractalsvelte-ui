<script>
	import { PortedButton } from 'fractalsvelte/ported';
	import { Icon } from 'fractalicons';
	import { luSettings, luBell } from 'fractalicons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<PortedButton size="icon-xs" aria-label="Settings">
		<Icon icon={luSettings} />
	</PortedButton>
	<PortedButton size="icon-sm" aria-label="Notifications">
		<Icon icon={luBell} />
	</PortedButton>
</div>
