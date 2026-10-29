<script lang="ts">
	import { ToastStack } from '$lib/styler';
	import type { ToastItem } from '$lib/styler';

	let toasts = $state<ToastItem[]>([
		{ id: '1', title: 'Saved', description: 'Your changes have been saved.', messageText: 'text-success', duration: 0 },
		{ id: '2', title: 'Sync paused', description: 'Reconnect to keep syncing.', messageText: 'text-warning', duration: 0 }
	]);
</script>

<ToastStack position="inline" bind:toasts />
