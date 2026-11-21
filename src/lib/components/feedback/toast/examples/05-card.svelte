<!-- @example Card :: The Toast card on its own, restyled through the surface, corner, inset, gap, icon scale, width and type ladders, with both of its buttons restyled through their own props bags, beside a loading toast. -->
<script lang="ts">
	import { Toast } from '@fractaldesign/fractalsvelte-ui';

	let gone = $state(false);
</script>

<div class="box gap-sm">
	{#if !gone}
		<Toast
			tone="success"
			message="Domain verified"
			description="atlas.studio is now serving traffic over HTTPS."
			surface="elevated"
			shape="curved"
			pad="pad-lg"
			gap="gap-sm"
			iconSize="text-md"
			measure="measure-md"
			textSize="text-md"
			childTextSize="text-sm"
			childTextColor="text-muted"
			dismissible
			action={{ label: 'View DNS', href: '#dns' }}
			cancel={{ label: 'Close' }}
			actionProps={{ variant: 'secondary' }}
			cancelProps={{ variant: 'outline' }}
			onDismiss={() => (gone = true)}
		/>
	{/if}
	<Toast loading tone="info" message="Publishing v2.8.1…" description="Six files are on their way to eu-west-3." />
</div>
