<!-- @example Icon, leading and trailing :: An icon, a text prefix and a unit inside the frame. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';
	import { luAtSign, luGlobe } from '@fractaldesign/icons/lucide';
</script>

{#snippet scheme()}
	<span class="text-muted text-sm select-none">https://</span>
{/snippet}

{#snippet suffix()}
	<span class="text-muted text-sm select-none">.fractal.app</span>
{/snippet}

<div class="box gap-sm measure-sm">
	<Input icon={luAtSign} placeholder="username" aria-label="Username" />
	<Input icon={luGlobe} leading={scheme} trailing={suffix} placeholder="acme" aria-label="Workspace address" />
</div>
