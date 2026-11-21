import type { Placement } from '../../../internal/tokens.js';

export function sideEnter(placement: Placement): string {
	return `enter-edge-${placement.split('-')[0]}`;
}
