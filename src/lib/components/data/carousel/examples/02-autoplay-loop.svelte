<!-- @example Autoplay, loop and layout :: loop wraps the ends; autoplay advances every 4s; perView and gap share the rail. -->
<script lang="ts">
	import { Carousel, CarouselSlide } from '@fractaldesign/fractalsvelte-ui';

	const quotes = [
		{ who: 'Amara Okafor', role: 'Engineering manager, Billing', text: 'The seat change was prorated correctly the first time. That almost never happens.' },
		{ who: 'Kenji Mori', role: 'Product designer, Growth', text: 'The empty state is quiet enough that I stopped adding my own illustration on top.' },
		{ who: 'Lukas Berg', role: 'Site reliability, Platform', text: 'I can finally scroll a 10,000-row deploy log without the tab locking up.' },
		{ who: 'Ines Duarte', role: 'Staff engineer, Platform', text: 'The sort caret springs. It sounds small. It is the reason the grid feels finished.' },
		{ who: 'Nina Varela', role: 'Data engineer, Analytics', text: 'Column visibility stayed put when I came back the next morning. That is the whole review.' }
	];

	let index = $state(0);

	function onIndexChange(next: number) {
		index = next;
	}
</script>

<div class="box gap-sm">
	<Carousel bind:index {onIndexChange} loop autoplay={4000} perView={2} gap="var(--space-bs)" label="Customer quotes">
		{#each quotes as quote (quote.who)}
			<CarouselSlide label={`${quote.who}, ${quote.role}`}>
				<figure class="box gap-sm border modern bg-surface pad-bs hfull">
					<blockquote class="text-sm text-secondary">{quote.text}</blockquote>
					<figcaption class="text-sm">
						<span class="weight-600">{quote.who}</span>
						<span class="text-muted"> · {quote.role}</span>
					</figcaption>
				</figure>
			</CarouselSlide>
		{/each}
	</Carousel>
	<p class="text-sm text-muted tabular-nums">Slide {index + 1} of {quotes.length}</p>
</div>
