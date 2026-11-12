<!-- @example Usage :: A few product shots with labels, previous and next, and a spring indicator. -->
<script lang="ts">
	import { Carousel, CarouselSlide } from '@fractaldesign/fractalsvelte-ui';

	const slides = [
		{ title: 'Northwind warehouse', copy: 'Same-day dispatch from Lisbon and Osaka, with live inventory on every SKU.' },
		{ title: 'Lumen Health clinic', copy: 'Appointment rooms in calm neutrals, designed around a waiting list that never feels like one.' },
		{ title: 'Fable & Co. atelier', copy: 'Limited runs of wool and linen, photographed in the studio on Hunstanton light.' },
		{ title: 'Orbital Labs bench', copy: 'A clean room you can actually work in — benches, racks and a quiet status wall.' }
	];
</script>

<Carousel label="Case studies">
	{#each slides as slide (slide.title)}
		<CarouselSlide label={slide.title}>
			<div class="box gap-sm border modern bg-surface pad-bs measure-sm">
				<p class="weight-600">{slide.title}</p>
				<p class="text-sm text-secondary">{slide.copy}</p>
			</div>
		</CarouselSlide>
	{/each}
</Carousel>
