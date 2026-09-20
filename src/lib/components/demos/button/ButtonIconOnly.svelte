<script>
	import { Button } from 'fractalsvelte/components';
	import { Icon } from 'fractalicons';
	import { luSettings, luBell, luArchive } from 'fractalicons/lucide';
</script>

<div class="row wrap gap-2xs ycenter">
	<Button size="icon-sm" variant="ghost" aria-label="Settings">
		<Icon icon={luSettings} />
	</Button>
	<Button size="icon" variant="outline" aria-label="Notifications">
		<Icon icon={luBell} />
	</Button>
	<Button size="icon-lg" variant="soft" aria-label="Archive">
		<Icon icon={luArchive} />
	</Button>
</div>
