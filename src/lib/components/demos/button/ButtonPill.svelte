<script>
	import { Button } from 'fractalsvelte/components';
	import { Icon } from 'fractalicons';
	import { luArrowRight } from 'fractalicons/lucide';
</script>

<div class="row wrap gap-2xs ycenter">
	<Button>Default</Button>
	<Button shape="pill">Pill</Button>
	<Button shape="pill" variant="secondary">
		Next
		<Icon icon={luArrowRight} />
	</Button>
</div>
