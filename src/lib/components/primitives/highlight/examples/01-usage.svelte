<!-- @example Usage :: Matching one or multiple search terms inside body copy, then an exact-case match of only the first hit. -->
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
	<p class="text-body">
		<Highlight
			text="Every Token is frozen; only the first Token in a sentence is matched."
			query="Token"
			ignoreCase={false}
			matchAll={false}
		/>
	</p>
</div>
