<!-- @example Group :: A stack of repositories with a hairline between them. -->
<script lang="ts">
	import {
		Item,
		ItemContent,
		ItemDescription,
		ItemGroup,
		ItemMedia,
		ItemSeparator,
		ItemTitle
	} from '@fractaldesign/fractalsvelte-ui';
	import { luBox } from '@fractaldesign/icons/lucide';
</script>

<div class="measure-sm border modern overflow-hidden">
	<ItemGroup>
		<Item>
			<ItemMedia icon={luBox} />
			<ItemContent>
				<ItemTitle>fractalsvelte-ui</ItemTitle>
				<ItemDescription>The component library. 114 packages on the registry.</ItemDescription>
			</ItemContent>
		</Item>
		<ItemSeparator />
		<Item>
			<ItemMedia icon={luBox} />
			<ItemContent>
				<ItemTitle>fractalstyler</ItemTitle>
				<ItemDescription>The class registry the library is written in.</ItemDescription>
			</ItemContent>
		</Item>
	</ItemGroup>
</div>
