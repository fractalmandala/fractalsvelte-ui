<script lang="ts">
	import { TreeList } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{
			id: 'src',
			label: 'src',
			children: [
				{ id: 'app', label: 'app.html' },
				{ id: 'lib', label: 'lib' }
			]
		},
		{ id: 'pkg', label: 'package.json' }
	];
</script>

<TreeList {items} />
