/** The edge a drawer is docked to. */
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

/** Enter class for each edge, matching `.enter-edge-*`. */
export const sideEnter: Record<DrawerSide, string> = {
	left: 'enter-edge-left',
	right: 'enter-edge-right',
	top: 'enter-edge-top',
	bottom: 'enter-edge-bottom'
};
