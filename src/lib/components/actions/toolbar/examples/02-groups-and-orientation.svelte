<!-- @example Groups and orientation :: Joined and spaced toggle clusters, a vertical toolbar, and a bar that does not wrap. -->
<script lang="ts">
	import { luTextAlignCenter, luTextAlignStart, luTextAlignEnd, luBold, luItalic, luUnderline } from '@fractaldesign/icons/lucide';
	import { Button, Toggle, Toolbar, ToolbarGroup, ToolbarSeparator } from '@fractaldesign/fractalsvelte-ui';

	let bold = $state(true);
	let italic = $state(false);
	let underline = $state(false);
	let align = $state('left');
	let zoom = $state('fit');
</script>

<div class="row wrap gap-lg ytop">
	<Toolbar label="Atlas typography" loop={false}>
		<ToolbarGroup label="Emphasis">
			<Toggle
				icon={luBold}
				aria-label="Bold"
				variant="ghost"
				size="sm"
				bind:pressed={bold}
				onPressedChange={(next) => (bold = next)}
			/>
			<Toggle
				icon={luItalic}
				aria-label="Italic"
				variant="ghost"
				size="sm"
				bind:pressed={italic}
				onPressedChange={(next) => (italic = next)}
			/>
			<Toggle
				icon={luUnderline}
				aria-label="Underline"
				variant="ghost"
				size="sm"
				bind:pressed={underline}
				onPressedChange={(next) => (underline = next)}
			/>
		</ToolbarGroup>
		<ToolbarSeparator />
		<ToolbarGroup label="Alignment">
			<Toggle
				icon={luTextAlignStart}
				aria-label="Align left"
				variant="ghost"
				size="sm"
				pressed={align === 'left'}
				onPressedChange={() => (align = 'left')}
			/>
			<Toggle
				icon={luTextAlignCenter}
				aria-label="Align centre"
				variant="ghost"
				size="sm"
				pressed={align === 'center'}
				onPressedChange={() => (align = 'center')}
			/>
			<Toggle
				icon={luTextAlignEnd}
				aria-label="Align right"
				variant="ghost"
				size="sm"
				pressed={align === 'right'}
				onPressedChange={() => (align = 'right')}
			/>
		</ToolbarGroup>
		<ToolbarSeparator />
		<ToolbarGroup label="Zoom" attached={false}>
			<Button variant="ghost" size="sm" onclick={() => (zoom = 'fit')}>Fit</Button>
			<Button variant="ghost" size="sm" onclick={() => (zoom = 'page')}>Page</Button>
		</ToolbarGroup>
	</Toolbar>

	<Toolbar orientation="vertical" label="Atlas zoom">
		<Button variant="outline" size="sm" onclick={() => (zoom = 'in')}>Zoom in</Button>
		<ToolbarSeparator />
		<Button variant="outline" size="sm" onclick={() => (zoom = 'out')}>Zoom out</Button>
	</Toolbar>

	<span class="text-sm text-muted">Zoom: {zoom}. Align {align}.</span>
</div>
