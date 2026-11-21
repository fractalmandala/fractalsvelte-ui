<!-- @example Inks :: the same link in three inks — the theme colour, body ink, and the muted secondary ink. -->
<script lang="ts">
	import { Link } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-lg">
	<Link href="/changelog">Changelog</Link>
	<Link href="/pricing" textColor="text-primary">Pricing</Link>
	<Link href="/status" textColor="text-secondary">System status</Link>
</div>
