<!-- @example Usage :: A card with a header, body and footer actions. -->
<script lang="ts">
	import {
		Button,
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@fractaldesign/fractalsvelte-ui';
</script>

<Card class="measure-sm">
	<CardHeader>
		<CardTitle>Invite your team</CardTitle>
		<CardDescription>Collaborators can comment, but only editors can publish.</CardDescription>
	</CardHeader>
	<CardContent>
		<p>Seats are billed monthly. You have 3 of 10 seats in use on the Team plan.</p>
	</CardContent>
	<CardFooter align="end">
		<Button variant="ghost">Later</Button>
		<Button>Send invites</Button>
	</CardFooter>
</Card>
