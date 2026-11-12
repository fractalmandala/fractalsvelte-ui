<!-- @example Overflow :: A team of eight, with max set so the rest collapse into a "+N" tile. -->
<script lang="ts">
	import { AvatarGroup } from '@fractaldesign/fractalsvelte-ui';

	const team = [
		{
			name: 'Maya Chen',
			src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces',
			alt: 'Maya Chen',
			status: 'online'
		},
		{
			name: 'Omar Haddad',
			src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces',
			alt: 'Omar Haddad',
			status: 'away'
		},
		{
			name: 'Priya Shah',
			src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=faces',
			alt: 'Priya Shah',
			status: 'online'
		},
		{ name: 'Jonas Berg', status: 'busy' },
		{ name: 'Elena Rossi', status: 'online' },
		{ name: 'Kenji Mori', status: 'offline' },
		{ name: 'Asha Patel', status: 'away' },
		{ name: 'Luca Moretti', status: 'online' }
	] as const;
</script>

<AvatarGroup items={[...team]} max={4} />
