<script lang="ts">
	import { AvatarGroup } from '$lib/styler';

	const avatars = [
		{ initials: 'AL', status: 'online' as const },
		{ initials: 'GH', status: 'offline' as const },
		{ initials: 'AT' },
		{ initials: 'KJ' },
		{ initials: 'MH' },
		{ initials: 'BL' }
	];
</script>

<AvatarGroup {avatars} max={3} />
