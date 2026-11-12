import type { Attachment } from 'svelte/attachments';
import type { Orientation } from './tokens.js';

export interface RovingOptions {
	/** Which descendants are items. */
	selector?: string;
	/** Which arrow keys move. `both` accepts all four. */
	orientation?: Orientation | 'both';
	/** Wrap from the last item to the first. */
	loop?: boolean;
	/** Jump to the item whose text starts with what is typed. */
	typeahead?: boolean;
	/** Manage `tabindex` so the group is one tab stop (roving tabindex). */
	tabindex?: boolean;
	/** Called when keyboard navigation lands on an item. */
	onNavigate?: (item: HTMLElement, index: number) => void;
}

const DEFAULT_SELECTOR =
	'[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"], [role="tab"], [role="radio"], [role="treeitem"], [data-roving]';

const enabled = (el: HTMLElement) =>
	!el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true' && !el.hidden;

/**
 * Keyboard navigation for a group of items: arrow keys, Home/End, optional
 * looping and typeahead, with a roving tabindex. Put it on the container.
 */
export function roving(options: RovingOptions = {}): Attachment<HTMLElement> {
	return (node) => {
		const {
			selector = DEFAULT_SELECTOR,
			orientation = 'vertical',
			loop = true,
			typeahead = false,
			tabindex = true,
			onNavigate
		} = options;

		const items = () => Array.from(node.querySelectorAll<HTMLElement>(selector)).filter(enabled);
		let buffer = '';
		let timer: ReturnType<typeof setTimeout> | undefined;

		const sync = (active?: HTMLElement) => {
			if (!tabindex) return;
			const all = items();
			const current =
				active ??
				all.find((el) => el.tabIndex === 0) ??
				all.find(
					(el) =>
						el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-checked') === 'true'
				) ??
				all[0];
			for (const el of all) el.tabIndex = el === current ? 0 : -1;
		};

		const go = (all: HTMLElement[], index: number) => {
			const item = all[index];
			if (!item) return;
			sync(item);
			item.focus();
			onNavigate?.(item, index);
		};

		const onKeydown = (event: KeyboardEvent) => {
			const all = items();
			if (all.length === 0) return;
			const index = all.indexOf(document.activeElement as HTMLElement);
			const prevKeys = orientation === 'horizontal' ? ['ArrowLeft'] : orientation === 'vertical' ? ['ArrowUp'] : ['ArrowLeft', 'ArrowUp'];
			const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] : orientation === 'vertical' ? ['ArrowDown'] : ['ArrowRight', 'ArrowDown'];
			let target = -1;

			if (nextKeys.includes(event.key)) target = index + 1 < all.length ? index + 1 : loop ? 0 : index;
			else if (prevKeys.includes(event.key)) target = index > 0 ? index - 1 : loop ? all.length - 1 : Math.max(index, 0);
			else if (event.key === 'Home') target = 0;
			else if (event.key === 'End') target = all.length - 1;
			else if (typeahead && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
				buffer += event.key.toLowerCase();
				clearTimeout(timer);
				timer = setTimeout(() => (buffer = ''), 500);
				const start = buffer.length === 1 ? index + 1 : Math.max(index, 0);
				const ordered = [...all.slice(start), ...all.slice(0, start)];
				const match = ordered.find((el) => (el.textContent ?? '').trim().toLowerCase().startsWith(buffer));
				if (match) go(all, all.indexOf(match));
				return;
			} else return;

			event.preventDefault();
			go(all, target);
		};

		const onFocusin = (event: FocusEvent) => {
			const item = (event.target as HTMLElement).closest<HTMLElement>(selector);
			if (item && node.contains(item)) sync(item);
		};

		sync();
		const observer = new MutationObserver(() => sync());
		observer.observe(node, { childList: true, subtree: true });
		node.addEventListener('keydown', onKeydown);
		node.addEventListener('focusin', onFocusin);
		return () => {
			clearTimeout(timer);
			observer.disconnect();
			node.removeEventListener('keydown', onKeydown);
			node.removeEventListener('focusin', onFocusin);
		};
	};
}
