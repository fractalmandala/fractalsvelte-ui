<!-- @example Icons :: Replace the tone's icon with your own, or remove it with icon={false}. -->
<script lang="ts">
	import { Alert } from '@fractaldesign/fractalsvelte-ui';
	import { luRocket } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-sm">
	<Alert tone="info" icon={luRocket} title="Launch week">Early access ends on Friday.</Alert>
	<Alert tone="neutral" icon={false}>Changes to roles take effect the next time a member signs in.</Alert>
</div>
