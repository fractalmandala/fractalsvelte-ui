<!-- @example Strength, radius and spring :: A soft pull, a strong one, and a disabled control that stays put. -->
<script lang="ts">
	import { Button, Magnetic } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-lg ycenter">
	<Magnetic strength={0.2} radius={24} spring="gentle">
		<Button variant="outline">Soft pull</Button>
	</Magnetic>
	<Magnetic strength={0.55} radius={64} spring="bouncy">
		<Button variant="themed">Strong pull</Button>
	</Magnetic>
	<Magnetic strength={0.55} radius={64} spring="stiff" disabled>
		<Button variant="secondary">Disabled</Button>
	</Magnetic>
</div>
