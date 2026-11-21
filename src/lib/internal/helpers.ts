import type { Attachment } from 'svelte/attachments';
import type {
	Orientation,
	Size,
} from './tokens.js';

// ── Floating / Top-Layer ─────────────────────────────────────────────────────

export function anchorName(id: string): string {
	return `--anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export function anchor(id: string): Attachment<HTMLElement> {
	return (node) => {
		node.style.setProperty('--anchor', anchorName(id));
		return () => node.style.removeProperty('--anchor');
	};
}

export function floating(id: string, offset?: string): Attachment<HTMLElement> {
	return (node) => {
		node.style.setProperty('--anchor', anchorName(id));
		if (offset) node.style.setProperty('--offset', offset);
		return () => {
			node.style.removeProperty('--anchor');
			node.style.removeProperty('--offset');
		};
	};
}

export function popoverSync(
	isOpen: () => boolean,
	onChange: (open: boolean) => void
): Attachment<HTMLElement> {
	return (node) => {
		const want = isOpen();
		const shown = node.matches(':popover-open');
		if (want && !shown) node.showPopover();
		else if (!want && shown) node.hidePopover();

		const onToggle = (event: Event) => {
			const next = (event as ToggleEvent).newState === 'open';
			if (next !== isOpen()) onChange(next);
		};
		node.addEventListener('toggle', onToggle);
		return () => node.removeEventListener('toggle', onToggle);
	};
}

export function dialogSync(
	isOpen: () => boolean,
	onChange: (open: boolean) => void,
	options: { modal?: boolean; dismissible?: boolean } = {}
): Attachment<HTMLDialogElement> {
	return (node) => {
		const { modal = true, dismissible = true } = options;
		const want = isOpen();
		if (want && !node.open) {
			if (modal) node.showModal();
			else node.show();
		} else if (!want && node.open) node.close();

		const onClose = () => {
			if (isOpen()) onChange(false);
		};
		const onCancel = (event: Event) => {
			if (!dismissible) event.preventDefault();
		};
		// A click that lands on the dialog element itself is a click on the backdrop.
		const onClick = (event: MouseEvent) => {
			if (dismissible && event.target === node) node.close();
		};
		node.addEventListener('close', onClose);
		node.addEventListener('cancel', onCancel);
		node.addEventListener('click', onClick);
		return () => {
			node.removeEventListener('close', onClose);
			node.removeEventListener('cancel', onCancel);
			node.removeEventListener('click', onClick);
		};
	};
}

// ── Roving Tabindex ──────────────────────────────────────────────────────────

export interface RovingOptions {
	selector?: string;
	orientation?: Orientation | 'both';
	loop?: boolean;
	typeahead?: boolean;
	tabindex?: boolean;
	onNavigate?: (item: HTMLElement, index: number) => void;
}

const DEFAULT_SELECTOR =
	'[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"], [role="tab"], [role="radio"], [role="treeitem"], [data-roving]';

const enabled = (el: HTMLElement) =>
	!el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true' && !el.hidden;

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

export function maxHeightStyle(maxHeight: Size | string | number | undefined): string | undefined {
	if (maxHeight === undefined || maxHeight === null) return undefined;
	if (typeof maxHeight === 'number') return `${maxHeight}px`;
	if (maxHeight.startsWith('h-')) return undefined;
	return maxHeight;
}
