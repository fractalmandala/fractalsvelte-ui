<!-- @example Compact command field :: A single-line composer at its own height and corner, with each edit acknowledged and every insertion listed. -->
<script lang="ts">
	import { TriggerMenu, type TriggerConfig } from '@fractaldesign/fractalsvelte-ui';

	const commands: TriggerConfig[] = [
		{
			trigger: '/',
			label: 'Commands',
			items: [
				{ value: 'deploy', label: 'deploy', description: 'Ship the current commit to staging', insertText: '/deploy ' },
				{ value: 'rollback', label: 'rollback', description: 'Return staging to the last release', insertText: '/rollback ' }
			]
		}
	];

	let draft = $state('/');
	let autosaved = $state('Nothing to save');
	let inserted = $state<string[]>([]);
</script>

<div class="column gap-sm measure-sm wfull">
	<TriggerMenu
		triggers={commands}
		bind:value={draft}
		onValueChange={(next) => (autosaved = next.trim() ? 'Draft saved' : 'Draft cleared')}
		onSelect={(item, trigger) => (inserted = [...inserted, `${trigger}${item.label}`])}
		placeholder="Type / for build commands"
		size="h-xl"
		shape="curved"
	/>
	<p class="text-xs text-muted">
		{autosaved} · Inserted: {inserted.length > 0 ? inserted.join(' · ') : 'nothing yet — click the field to open the menu'}
	</p>
</div>
