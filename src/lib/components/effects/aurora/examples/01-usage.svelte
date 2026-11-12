<!-- @example Usage :: A product hero sitting on a slow aurora. -->
<script lang="ts">
	import { Aurora, Button, GradientText } from '@fractaldesign/fractalsvelte-ui';
</script>

<Aurora class="curved pad-2xl box gap-md xcenter">
	<p class="text-sm text-secondary">Preview deploys, from every branch</p>
	<h2 class="page-title"><GradientText>Ship the night build</GradientText></h2>
	<p class="text-body text-secondary measure-md">Every pull request gets its own URL, logs and a screenshot of the last run. Merge when the night build is the one you would ship.</p>
	<div class="row gap-sm">
		<Button>Start a project</Button>
		<Button variant="secondary">Read the walkthrough</Button>
	</div>
</Aurora>
