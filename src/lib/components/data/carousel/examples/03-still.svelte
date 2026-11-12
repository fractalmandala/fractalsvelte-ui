<!-- @example Still and single :: autoplay={false} and loop={false} keep the rail still until the user moves it; perView={1} shows one slide. -->
<script lang="ts">
	import { Carousel, CarouselSlide } from '@fractaldesign/fractalsvelte-ui';
</script>

<Carousel autoplay={false} loop={false} perView={1} gap="var(--space-lg)" label="Release highlights" class="measure-md">
	<CarouselSlide label="Sticky headers">
		<div class="box gap-xs border modern bg-surface pad-bs">
			<p class="weight-600">Sticky headers</p>
			<p class="text-sm text-secondary">A height-capped table keeps its header in view while the body scrolls.</p>
		</div>
	</CarouselSlide>
	<CarouselSlide label="Detail rows">
		<div class="box gap-xs border modern bg-surface pad-bs">
			<p class="weight-600">Detail rows</p>
			<p class="text-sm text-secondary">Expand a record to read its runbook without leaving the grid.</p>
		</div>
	</CarouselSlide>
	<CarouselSlide>
		<div class="box gap-xs border modern bg-surface pad-bs">
			<p class="weight-600">Column visibility</p>
			<p class="text-sm text-secondary">Hide a column from the menu; bring it back the same way.</p>
		</div>
	</CarouselSlide>
</Carousel>
