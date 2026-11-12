<!-- @example Spread :: The default hover spring, next to a group that stays put. -->
<script lang="ts">
	import { AvatarGroup } from '@fractaldesign/fractalsvelte-ui';

	const team = [
		{ name: 'Maya Chen' },
		{ name: 'Omar Haddad' },
		{ name: 'Priya Shah' },
		{ name: 'Jonas Berg' }
	];
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<span class="text-sm text-muted">Hover to spread</span>
		<AvatarGroup items={team} />
	</div>
	<div class="box gap-xs">
		<span class="text-sm text-muted">Spread off</span>
		<AvatarGroup items={team} spread={false} />
	</div>
</div>
