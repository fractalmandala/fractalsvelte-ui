<!-- @example Usage :: A primary action and a menu of alternatives. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	let strategy = $state('merge commit');
</script>

<div class="box gap-sm">
	<SplitButton
		onclick={() => (strategy = 'merge commit')}
		items={[
			{ label: 'Squash and merge', onSelect: () => (strategy = 'squash') },
			{ label: 'Rebase and merge', onSelect: () => (strategy = 'rebase') }
		]}
	>
		Merge pull request
	</SplitButton>
	<p class="text-sm text-secondary">Last strategy: {strategy}</p>
</div>
