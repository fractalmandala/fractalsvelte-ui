<!-- @example Loading and disabled :: loading swaps in a spinner and blocks clicks; disabled removes the button from interaction. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
	import { luSave } from '@fractaldesign/icons/lucide';

	let loading = $state(false);

	function save() {
		loading = true;
		setTimeout(() => (loading = false), 1600);
	}
</script>

<div class="row wrap gap-sm ycenter">
	<Button icon={luSave} {loading} onclick={save}>{loading ? 'Saving' : 'Save changes'}</Button>
	<Button variant="outline" disabled>Unavailable</Button>
</div>
