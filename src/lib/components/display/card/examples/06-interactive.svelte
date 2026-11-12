<!-- @example Interactive and tilt :: A link card, a button-like card and a card that leans toward the pointer. -->
<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fractaldesign/fractalsvelte-ui';

	let opened = $state(0);
</script>

<div class="card-grid gap-bs">
	<Card href="https://fractalsvelte.dev" target="_blank">
		<CardHeader>
			<CardTitle>Read the changelog</CardTitle>
			<CardDescription>What shipped this week</CardDescription>
		</CardHeader>
	</Card>
	<Card interactive onclick={() => opened++}>
		<CardHeader>
			<CardTitle>Open the project</CardTitle>
			<CardDescription>Opened {opened} times</CardDescription>
		</CardHeader>
	</Card>
	<Card tilt variant="glass">
		<CardHeader>
			<CardTitle>Hover and lean</CardTitle>
			<CardDescription>Springs back when you leave</CardDescription>
		</CardHeader>
		<CardContent>The tilt replaces the lift.</CardContent>
	</Card>
</div>
