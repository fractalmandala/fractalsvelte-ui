<!-- @example Usage :: A light card nested inside a dark surface, each themed independently of the page. -->
<script lang="ts">
	import { Button, ThemeProvider } from '@fractaldesign/fractalsvelte-ui';
</script>

<ThemeProvider mode="dark" theme="ocean" class="column gap-bs pad-lg radius-lg border">
	<p class="text-sm text-secondary">Release dashboard</p>
	<h3 class="card-title">Deploys are healthy</h3>

	<ThemeProvider mode="light" theme="ocean" class="column gap-sm pad-bs radius-md rim shad-md">
		<p class="text-sm text-muted">Invoice INV-2048</p>
		<p class="weight-600 tabular-nums">$1,284.00 due 18 Nov</p>
		<div class="row gap-sm">
			<Button size="sm">Pay now</Button>
			<Button size="sm" variant="secondary">Download PDF</Button>
		</div>
	</ThemeProvider>
</ThemeProvider>
