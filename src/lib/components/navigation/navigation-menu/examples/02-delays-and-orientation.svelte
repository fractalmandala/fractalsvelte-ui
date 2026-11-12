<!-- @example Delays, orientation and control :: A bound menu with a custom delay, a vertical solid bar, a disabled item and a current link. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
	import {
		NavigationMenu,
		NavigationMenuContent,
		NavigationMenuItem,
		NavigationMenuLink
	} from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>(null);
</script>

<div class="row wrap gap-lg ytop">
	<div class="box gap-sm">
		<NavigationMenu
			bind:value
			onValueChange={(next) => (value = next)}
			delayDuration={400}
			skipDelayDuration={150}
			surface="glass"
			orientation="horizontal"
			label="Atlas desk"
		>
			<NavigationMenuItem value="products">
				{#snippet trigger({ props })}
					<Button variant="ghost" size="sm" {...props}>Products</Button>
				{/snippet}
				<NavigationMenuContent>
					<div class="box gap-xs pad-xs">
						<a href="/atlas/charts" class="item">Harbour charts</a>
						<a href="/atlas/guides" class="item">Field guides</a>
					</div>
				</NavigationMenuContent>
			</NavigationMenuItem>
			<NavigationMenuItem value="archive" label="Archive" disabled>
				<NavigationMenuContent>
					<p class="text-sm text-secondary">The archive opens again in March.</p>
				</NavigationMenuContent>
			</NavigationMenuItem>
			<NavigationMenuLink href="/atlas/docs" current>Docs</NavigationMenuLink>
		</NavigationMenu>
		<span class="text-sm text-muted">{value ? `${value} is open` : 'Every panel is closed'}</span>
	</div>

	<NavigationMenu orientation="vertical" surface="solid" label="Atlas sections">
		<NavigationMenuItem value="charts" label="Charts">
			<NavigationMenuContent>
				<div class="box gap-xs pad-xs">
					<a href="/atlas/charts/harbour" class="item">Harbour approaches</a>
					<a href="/atlas/charts/tides" class="item">Tide tables</a>
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
		<NavigationMenuItem value="guides" label="Guides">
			<NavigationMenuContent>
				<div class="box gap-xs pad-xs">
					<a href="/atlas/guides/birds" class="item">Coastal birds</a>
					<a href="/atlas/guides/winds" class="item">Local winds</a>
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
		<NavigationMenuLink href="/atlas/about">About</NavigationMenuLink>
	</NavigationMenu>
</div>
