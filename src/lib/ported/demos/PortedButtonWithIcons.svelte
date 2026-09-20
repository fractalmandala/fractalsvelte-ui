<script>
	import { PortedButton } from 'fractalsvelte/ported';
	import { Icon } from 'fractalicons';
	import { luMail, luArrowRight } from 'fractalicons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<PortedButton variant="secondary">
		<Icon icon={luMail} />
		Email us
	</PortedButton>
	<PortedButton variant="outline">
		Continue
		<Icon icon={luArrowRight} />
	</PortedButton>
</div>
