import { createContext } from 'svelte';

export interface SlideMeta {
	label?: string;
	node: HTMLElement;
}

export interface CarouselContext {
	uid: string;
	register: (meta: SlideMeta) => () => void;
	index: () => number;
	total: () => number;
	position: (node: HTMLElement | null) => number;
}

export const [getCarousel, setCarousel] = createContext<CarouselContext>();
