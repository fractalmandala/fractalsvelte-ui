<!-- @example Groups, icons and descriptions :: Options grouped under headings, each with an icon and a second line; one is disabled, and clearable adds a reset button. -->
<script lang="ts">
	import { Select, type SelectOption } from '@fractaldesign/fractalsvelte-ui';
	import { luCloud, luDatabase, luGitBranch, luServer } from '@fractaldesign/icons/lucide';

	let source = $state<string | null>(null);
	const sources: SelectOption[] = [
		{ value: 'github', label: 'GitHub', description: 'Deploy on every push to main', icon: luGitBranch, group: 'Git' },
		{ value: 'gitlab', label: 'GitLab', description: 'Self-managed or gitlab.com', icon: luGitBranch, group: 'Git' },
		{ value: 'postgres', label: 'PostgreSQL', description: 'Logical replication', icon: luDatabase, group: 'Databases' },
		{ value: 'mysql', label: 'MySQL', description: 'Requires binlog access — contact sales', icon: luDatabase, group: 'Databases', disabled: true },
		{ value: 's3', label: 'Amazon S3', description: 'Bucket notifications', icon: luCloud, group: 'Storage' },
		{ value: 'sftp', label: 'SFTP', description: 'Poll every five minutes', icon: luServer, group: 'Storage' }
	];
</script>

<div class="measure-xs">
	<Select options={sources} bind:value={source} clearable placeholder="Connect a source" aria-label="Source" />
</div>
