<!-- @example Usage :: Matching one or multiple search terms inside body copy. -->
<script lang="ts">
	import { Highlight } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-sm">
	<p class="text-body">
		<Highlight
			text="Search results highlight tokens cleanly in place."
			query="tokens"
		/>
	</p>
	<p class="text-body">
		<Highlight
			text="Supports multiple queries, themes, and safe escaping (v2.0)."
			query={['multiple', 'escaping']}
			variant="info"
		/>
	</p>
</div>
