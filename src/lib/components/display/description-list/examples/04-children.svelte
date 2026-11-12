<!-- @example Children :: Custom markup inside the list, for a definition that holds more than a string. -->
<script lang="ts">
	import { DescriptionList } from '@fractaldesign/fractalsvelte-ui';
</script>

<DescriptionList orientation="horizontal" class="measure-md">
	<div class="pair-row">
		<dt class="text-sm text-secondary weight-500">Primary domain</dt>
		<dd class="text-md text-primary">app.mintfolio.dev</dd>
	</div>
	<div class="pair-row">
		<dt class="text-sm text-secondary weight-500">Redirects</dt>
		<dd class="box gap-xs">
			<span>mintfolio.dev</span>
			<span>www.mintfolio.dev</span>
		</dd>
	</div>
	<div class="pair-row">
		<dt class="text-sm text-secondary weight-500">TLS</dt>
		<dd class="text-md text-primary">Let’s Encrypt, renews 4 Jan 2027</dd>
	</div>
</DescriptionList>
