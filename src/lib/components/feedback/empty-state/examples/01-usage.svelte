<!-- @example Usage :: A quiet empty list, with a title and a short explanation. -->
<script lang="ts">
	import { EmptyState } from '@fractaldesign/fractalsvelte-ui';
	import { luInbox } from '@fractaldesign/icons/lucide';
</script>

<EmptyState
	icon={luInbox}
	title="No deployments yet"
	description="Push to main, or trigger a run from a pull request, and it will show up here."
/>
