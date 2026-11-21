<!-- @example Fallback :: A photograph, a broken image that falls back to initials, and a nameless icon — each reporting the state it reached. -->
<script lang="ts">
	import { luUserRound } from '@fractaldesign/icons/lucide';
	import { Avatar } from '@fractaldesign/fractalsvelte-ui';

	let photo = $state('loading');
	let broken = $state('loading');
</script>

<div class="row wrap ycenter gap-lg">
	<div class="box xcenter gap-xs">
		<Avatar
			name="Maya Chen"
			src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces"
			alt="Maya Chen"
			status="online"
			onStatusChange={(next) => (photo = next)}
		/>
		<span class="text-xs text-muted">Photograph · {photo}</span>
	</div>
	<div class="box xcenter gap-xs">
		<Avatar
			name="Omar Haddad"
			src="https://example.invalid/missing-portrait.jpg"
			alt="Omar Haddad"
			onStatusChange={(next) => (broken = next)}
		/>
		<span class="text-xs text-muted">Broken image · {broken}</span>
	</div>
	<div class="box xcenter gap-xs">
		<Avatar />
		<span class="text-xs text-muted">Default icon</span>
	</div>
	<div class="box xcenter gap-xs">
		<Avatar icon={luUserRound} />
		<span class="text-xs text-muted">Custom icon</span>
	</div>
</div>
