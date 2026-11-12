const fade = 'var(--space-lg)';

/** Writes edge-fade custom properties from the element's current scroll position. */
export function attachFades(axes: { y: boolean; x: boolean }): (node: HTMLElement) => () => void {
	return (node) => {
		const write = (): void => {
			if (axes.y) {
				const max = node.scrollHeight - node.clientHeight;
				node.style.setProperty('--fade-top', node.scrollTop > 1 ? fade : '0px');
				node.style.setProperty('--fade-bottom', max - node.scrollTop > 1 ? fade : '0px');
			}
			if (axes.x) {
				const max = node.scrollWidth - node.clientWidth;
				node.style.setProperty('--fade-left', node.scrollLeft > 1 ? fade : '0px');
				node.style.setProperty('--fade-right', max - node.scrollLeft > 1 ? fade : '0px');
			}
		};
		write();
		node.addEventListener('scroll', write, { passive: true });
		const ro = new ResizeObserver(write);
		ro.observe(node);
		const kids = new MutationObserver(() => {
			write();
			for (const child of node.children) if (child instanceof Element) ro.observe(child);
		});
		kids.observe(node, { childList: true });
		for (const child of node.children) if (child instanceof Element) ro.observe(child);
		return () => {
			node.removeEventListener('scroll', write);
			ro.disconnect();
			kids.disconnect();
			node.style.removeProperty('--fade-top');
			node.style.removeProperty('--fade-bottom');
			node.style.removeProperty('--fade-left');
			node.style.removeProperty('--fade-right');
		};
	};
}
