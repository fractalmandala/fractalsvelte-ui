<script lang="ts" module>
	export interface Ripple {
		id: number;
		x: number;
		y: number;
		r: number;
	}

	/** Builds a ripple centred on the pointer (or the box) that reaches every corner. */
	export function makeRipple(e: PointerEvent | MouseEvent, host: Element, id: number, center = false): Ripple {
		const rect = host.getBoundingClientRect();
		const x = center ? rect.width / 2 : e.clientX - rect.left;
		const y = center ? rect.height / 2 : e.clientY - rect.top;
		const r = Math.max(
			Math.hypot(x, y),
			Math.hypot(rect.width - x, y),
			Math.hypot(x, rect.height - y),
			Math.hypot(rect.width - x, rect.height - y)
		);
		return { id, x, y, r };
	}
</script>

<script lang="ts">
	// One fresh <svg> per ripple: an inline SVG starts its own SMIL timeline
	// when inserted, so begin="0s" plays each wave from the click.
	import type { MessageText } from '../types';

	interface Props {
		ripples: Ripple[];
		/** ms */
		duration?: number;
		tone?: MessageText | 'text-white';
		opacity?: number;
	}

	let { ripples, duration = 600, tone = 'text-white', opacity = 0.35 }: Props = $props();
</script>

{#each ripples as r (r.id)}
	<svg class="absolute full {tone ?? 'text-theme'}" pointer-events="none" aria-hidden="true">
		<circle cx={r.x} cy={r.y} r="0" fill="currentColor" opacity={opacity}>
			<animate attributeName="r" from="0" to={r.r} dur="{duration}ms" fill="freeze" />
			<animate attributeName="opacity" from={opacity} to="0" dur="{duration}ms" fill="freeze" />
		</circle>
	</svg>
{/each}
