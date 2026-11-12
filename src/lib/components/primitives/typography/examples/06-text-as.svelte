<!-- @example As :: Text can render as a paragraph, a span, a div, or a typographic inline tag. -->
<script lang="ts">
	import { Text } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-md">
	<Text as="p">A full paragraph of release notes sits on its own line.</Text>
	<Text as="div">A block of supporting copy that is not a paragraph.</Text>
	<p class="row wrap ycenter gap-xs">
		<Text as="span" variant="muted">Build status</Text>
		<Text as="strong">stable</Text>
		<Text as="em">since this morning</Text>
		<Text as="small" variant="muted">Updated a few minutes ago</Text>
	</p>
	<Text as="label">Workspace name</Text>
</div>
