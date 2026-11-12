<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { PasswordInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<PasswordInput size="lg" textSize="xs" value="correct-horse" aria-label="Extra-small type" autocomplete="off" />
	<PasswordInput size="lg" textSize="sm" value="correct-horse" aria-label="Small type" autocomplete="off" />
	<PasswordInput size="lg" textSize="md" value="correct-horse" aria-label="Medium type" autocomplete="off" />
	<PasswordInput size="lg" textSize="lg" value="correct-horse" aria-label="Large type" autocomplete="off" />
	<PasswordInput size="lg" textSize="xl" value="correct-horse" aria-label="Extra-large type" autocomplete="off" />
</div>
