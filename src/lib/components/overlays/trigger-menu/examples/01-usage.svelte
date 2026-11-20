<!-- @example Usage :: Mentioning teammates with `@` or running slash commands with `/` in a message composer. -->
<script lang="ts">
	import { TriggerMenu, type TriggerConfig } from '@fractaldesign/fractalsvelte-ui';

	const triggers: TriggerConfig[] = [
		{
			trigger: '@',
			label: 'People',
			items: [
				{ value: 'ada', label: 'ada', description: 'Systems lead' },
				{ value: 'linus', label: 'linus', description: 'Kernel maintainer' },
				{ value: 'grace', label: 'grace', description: 'Compiler architect' }
			]
		},
		{
			trigger: '/',
			label: 'Commands',
			items: [
				{ value: 'assign', label: 'assign', description: 'Assign an owner', insertText: '/assign ' },
				{ value: 'deploy', label: 'deploy', description: 'Trigger staging build', insertText: '/deploy ' }
			]
		}
	];

	let text = $state('');
</script>

<div class="column gap-sm measure-sm wfull">
	<TriggerMenu {triggers} bind:value={text} multiline rows={3} />
</div>
