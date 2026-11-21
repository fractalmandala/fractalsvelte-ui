<!-- @example Text :: The link takes its own scale, and textColor overrides the ink a subtle look would use. -->
<script lang="ts">
	import { Link } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md measure-md">
	<p class="text-md text-secondary">
		Read the <Link href="/docs/billing" textSize="text-lg">billing guide</Link> before the plan renews.
	</p>
	<div class="row wrap gap-lg ycenter">
		<Link href="/changelog" textSize="text-sm" textColor="text-muted">Changelog</Link>
		<Link href="/status" textSize="text-md" textColor="text-secondary">System status</Link>
		<Link href="/workspace/delete" textSize="text-md" textColor="text-danger" underline="always">
			Delete workspace
		</Link>
	</div>
</div>
