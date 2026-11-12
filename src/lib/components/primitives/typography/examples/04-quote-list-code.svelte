<!-- @example Quote, lists and code :: A blockquote, a bulleted list, a numbered list and inline code. -->
<script lang="ts">
	import { Blockquote, InlineCode, List, Text, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography>
	<Blockquote>
		<Text>A component and its documentation are one. Neither is done without the other.</Text>
	</Blockquote>
	<List as="ul">
		<li>Compose from registered classes; do not add a type scale of your own.</li>
		<li>Keep the reading measure with <InlineCode>Typography</InlineCode>.</li>
		<li>Prefer a real heading to a styled <InlineCode>div</InlineCode>.</li>
	</List>
	<List as="ol">
		<li>Write the brief against the existing classes.</li>
		<li>Run <InlineCode>pnpm verify primitives/typography</InlineCode>.</li>
		<li>Read the page back at the actual type sizes.</li>
	</List>
</Typography>
