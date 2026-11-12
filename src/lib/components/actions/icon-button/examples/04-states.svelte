<!-- @example States :: loading swaps in a spinner, disabled dims the button, and pressable={false} removes the spring. -->
<script lang="ts">
	import { IconButton } from '@fractaldesign/fractalsvelte-ui';
	import { luRefreshCw, luSave, luTrash2 } from '@fractaldesign/icons/lucide';

	let saving = $state(false);

	function save() {
		saving = true;
		setTimeout(() => (saving = false), 1600);
	}
</script>

<div class="row wrap gap-sm ycenter">
	<IconButton icon={luSave} label="Save draft" variant="secondary" loading={saving} onclick={save} />
	<IconButton icon={luRefreshCw} label="Refreshing" variant="outline" loading />
	<IconButton icon={luTrash2} label="Delete (unavailable)" variant="outline" disabled />
	<IconButton icon={luRefreshCw} label="Refresh, no spring" variant="outline" pressable={false} />
</div>
