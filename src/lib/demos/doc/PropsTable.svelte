<script lang="ts">
	import { PropsTable } from '$lib/styler';

	const items = [
		{ name: 'variant', type: 'Variant', optional: true, default: "'primary'" },
		{ name: 'disabled', type: 'boolean', optional: true, default: 'false' }
	];
</script>

<PropsTable {items} />
