<script>
	import { Button } from 'fractalsvelte/components';
	import { Icon } from 'fractalicons';
	import { luMail, luArrowRight } from 'fractalicons/lucide';
</script>

<div class="row wrap gap-2xs ycenter">
	<Button variant="secondary">
		<Icon icon={luMail} />
		Email us
	</Button>
	<Button variant="outline">
		Continue
		<Icon icon={luArrowRight} />
	</Button>
</div>
