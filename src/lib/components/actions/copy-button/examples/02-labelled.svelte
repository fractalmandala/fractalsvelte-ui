<!-- @example Labelled :: With children the button shows text, and copiedLabel replaces it after a copy. -->
<script lang="ts">
	import { CopyButton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<CopyButton text="https://fractalsvelte.dev/invite/7Hq2-xv9L" variant="secondary">Copy invite link</CopyButton>
	<CopyButton text="sk_test_4eC39HqLyjWDarjtT1zdp7dc" variant="outline" copiedLabel="Key copied">Copy API key</CopyButton>
</div>
