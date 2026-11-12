<!-- @example Usage :: A Northwind Atlas nav with Products and Solutions flyouts, a sliding indicator, and a Docs link. -->
<script lang="ts">
	import {
		NavigationMenu,
		NavigationMenuContent,
		NavigationMenuItem,
		NavigationMenuLink
	} from '@fractaldesign/fractalsvelte-ui';
</script>

<NavigationMenu orientation="horizontal" label="Northwind Atlas">
	<NavigationMenuItem value="products" label="Products">
		<NavigationMenuContent>
			<div class="grid-2 gap-md">
				<a href="/atlas/charts" class="box gap-xs pad-sm radius-md">
					<span class="weight-500 text-primary">Harbour charts</span>
					<span class="text-sm text-secondary">Tide tables and approach maps, updated twice a year.</span>
				</a>
				<a href="/atlas/guides" class="box gap-xs pad-sm radius-md">
					<span class="weight-500 text-primary">Field guides</span>
					<span class="text-sm text-secondary">Coastal birds, mosses and the working names of local winds.</span>
				</a>
			</div>
		</NavigationMenuContent>
	</NavigationMenuItem>
	<NavigationMenuItem value="solutions" label="Solutions">
		<NavigationMenuContent>
			<div class="box gap-sm">
				<a href="/atlas/newsrooms" class="box gap-xs pad-sm radius-md">
					<span class="weight-500 text-primary">For newsrooms</span>
					<span class="text-sm text-secondary">A desk licence for editors who file from the harbour.</span>
				</a>
				<a href="/atlas/libraries" class="box gap-xs pad-sm radius-md">
					<span class="weight-500 text-primary">For libraries</span>
					<span class="text-sm text-secondary">A quiet catalogue of every printed edition still in circulation.</span>
				</a>
			</div>
		</NavigationMenuContent>
	</NavigationMenuItem>
	<NavigationMenuLink href="/atlas/docs">Docs</NavigationMenuLink>
</NavigationMenu>
