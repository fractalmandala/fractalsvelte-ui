<!-- @example As a link :: href renders an anchor, and target opens it in a new tab. -->
<script lang="ts">
	import { IconButton } from '@fractaldesign/fractalsvelte-ui';
	import { luExternalLink, luGitBranch } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<IconButton icon={luGitBranch} label="View the repository" variant="outline" href="https://github.com/sveltejs/svelte" target="_blank" />
	<IconButton icon={luExternalLink} label="Read the Svelte docs" variant="ghost" href="https://svelte.dev/docs" />
</div>
