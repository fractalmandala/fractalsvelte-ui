<!-- @example Collected headings :: With no items, Toc reads headings out of a container. -->
<script lang="ts">
	import { Toc } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row gap-xl ytop">
	<article id="studio-notes" class="scroll-y cap grow pad-bs box gap-lg">
		<h2 id="cameras" class="page-heading-bs">Cameras</h2>
		<p class="text-body text-secondary">
			The mid-format body lives on the left bench, with the 80 and the 150 in the drawer beneath
			it. Backs are labelled by sitting, not by date.
		</p>
		<p class="text-body text-secondary">
			A spare 35 sits on the window ledge for walk-around notes. It is not used for published work.
		</p>
		<h2 id="darkroom" class="page-heading-bs">The darkroom</h2>
		<p class="text-body text-secondary">
			The tray line is developer, stop, fix, and a long wash. Papers are stored above the sink,
			graded, in their original envelopes.
		</p>
		<h3 id="chemistry" class="page-heading-bs">Chemistry</h3>
		<p class="text-body text-secondary">
			Stock solutions are mixed on Monday and discarded on Friday. A note on the door records the
			last change of the fixer.
		</p>
	</article>
	<div class="shrink-0">
		<Toc container="#studio-notes" headingSelector="h2, h3, h4" label="Notes" />
	</div>
</div>
