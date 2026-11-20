import type { Attachment } from 'svelte/attachments';
import type {
	Align,
	AlignContent,
	Gap,
	Measure,
	Orientation,
	Placement,
	Shape,
	Size,
	Surface,
	TextColor,
	Tone,
	Variant
} from './tokens.js';

// ── Floating / Top-Layer ─────────────────────────────────────────────────────

/** The CSS anchor name for an id — `$props.id()` output is a fine id. */
export function anchorName(id: string): string {
	return `--anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/**
 * Pair a trigger with its floating element. Put `{@attach anchor(id)}` on the
 * trigger (with class `anchor`) and `{@attach floating(id)}` on the floating
 * element (with class `floating at-…`): both receive the same `--anchor`
 * name, and CSS anchor positioning does the rest.
 */
export function anchor(id: string): Attachment<HTMLElement> {
	return (node) => {
		node.style.setProperty('--anchor', anchorName(id));
		return () => node.style.removeProperty('--anchor');
	};
}

/** The floating side of `anchor()`. `offset` overrides the gap (any CSS length or token). */
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

/**
 * Keep a boolean in step with a native popover element.
 * Returns an attachment for the `[popover]` element: it shows/hides the
 * popover when `isOpen()` changes and reports user dismissal through `onChange`.
 */
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

/**
 * The same for a native `<dialog>`: opens modally when `isOpen()` turns true,
 * closes when it turns false, and reports Esc / backdrop dismissal.
 */
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

// ── Class & Style Helpers ────────────────────────────────────────────────────

/** `.floating` placement modifier for a `Placement`. */
export const placementClass: Record<Placement, string> = {
	top: 'at-top',
	'top-start': 'at-top-start',
	'top-end': 'at-top-end',
	bottom: 'at-bottom',
	'bottom-start': 'at-bottom-start',
	'bottom-end': 'at-bottom-end',
	left: 'at-left',
	'left-start': 'at-left-start',
	'left-end': 'at-left-end',
	right: 'at-right',
	'right-start': 'at-right-start',
	'right-end': 'at-right-end'
};

/** Text colour class for a tone. */
export const toneText: Record<Tone, string> = {
	neutral: 'text-neutral',
	info: 'text-info',
	success: 'text-success',
	warning: 'text-warning',
	danger: 'text-danger'
};

/** Row/container flex alignment helper. */
export const justifyClass: Record<Align, string> = {
	left: 'xleft',
	center: 'xcenter',
	right: 'xright',
	between: 'xbetween'
};

/** Text alignment helper. */
export const textAlignClass: Record<'left' | 'center' | 'right', string> = {
	left: 'ta-l',
	center: 'ta-c',
	right: 'ta-r'
};

const gapMap: Record<Gap, string> = {
	'': '0px',
	'gap-xs': 'var(--space-xs)',
	'gap-sm': 'var(--space-sm)',
	'gap-md': 'var(--space-md)',
	'gap-bs': 'var(--space-bs)',
	'gap-lg': 'var(--space-lg)',
	'gap-xl': 'var(--space-xl)',
	'gap-2xl': 'var(--space-2xl)',
	'gap-3xl': 'var(--space-3xl)'
};

/** CSS length expression for a `Gap` rung. */
export function gapValue(gap: Gap): string {
	return gapMap[gap] ?? 'var(--space-bs)';
}

/** The registered surface class per `Surface`. `outlined` also paints the surface fill, which its edge alone does not. */
export const surfaceClass: Record<Surface, string> = {
	elevated: 'elevated',
	outlined: 'outlined',
	vacant: 'vacant',
	paneled: 'paneled',
	overlayed: 'overlayed',
	glass: 'glass'
};

/**
 * A surface's class plus the decorations that belong to the same element.
 *
 * `tight` (the default) adds the `surface-tight` class from the data kit
 * fragment, which zeros the 16px inset every surface class carries, so a
 * component's own padding stays the only inset and `.stack-rule` dividers
 * reach the border. `clip` (the default) adds `overflow-hidden` so the radius
 * cuts the children. `vacant` has no edge, so it takes neither the clip nor
 * the radius.
 *
 * Both depend on the consumer: `@fractaldesign/fractalsvelte-ui/styles` must
 * load after `@fractaldesign/fractalstyler/styles`.
 */
export function surfaceClasses(
	surface: Surface,
	shape: Shape,
	options: { clip?: boolean; tight?: boolean } = {}
): string[] {
	const { clip = true, tight = true } = options;
	if (surface === 'vacant') {
		return tight ? ['surface-tight', surfaceClass.vacant] : [surfaceClass.vacant];
	}
	const classes = tight
		? ['surface-tight', surfaceClass[surface], shape]
		: [surfaceClass[surface], shape];
	return clip ? [...classes, 'overflow-hidden'] : classes;
}

/**
 * The classes an `AlignContent` needs on a `box`.
 *
 * `xbetween` sets `justify-content`, which a column does not use, so it takes
 * `ta-l` as well: a disclosure's label and caret still meet at the edges, and
 * the text never inherits its alignment from a wrapping stage. `mleft` only
 * bites beside `ta-c` or `ta-r` (fractalstyler's typography.css), so the two
 * mobile-first values carry the text-align class they belong with.
 */
export const alignContentClasses: Record<AlignContent, string[]> = {
	xleft: ['xleft'],
	xcenter: ['xcenter'],
	xright: ['xright'],
	xbetween: ['xbetween', 'ta-l'],
	'xcenter mleft': ['xcenter', 'ta-c', 'mleft'],
	'xright mleft': ['xright', 'ta-r', 'mleft']
};

/** Max-height custom property value for a `Measure`: `measure-lg` → `var(--measure-lg)`. */
export function maxHeightVar(maxHeight: Measure | undefined): string | undefined {
	return maxHeight ? `var(--${maxHeight})` : undefined;
}

/** Max-height utility class when `maxHeight` is a `Size` (`h-*`). */
export function maxHeightClass(maxHeight: Size | string | number | undefined): string {
	if (!maxHeight || typeof maxHeight === 'number') return '';
	if (maxHeight.startsWith('h-')) {
		const step = maxHeight.slice(2);
		return step === 'bs' ? 'max-h-md' : `max-h-${step}`;
	}
	return '';
}

const WHITE_TEXT_VARIANTS = new Set<Variant>(['themed', 'info', 'success', 'warning', 'danger']);

/** Default `TextColor` for a `Variant`: `text-inverse` on `primary`, `text-white` on `themed`/status variants, `text-primary` on light ones. */
export function defaultTextColor(variant?: Variant): TextColor {
	if (variant === 'primary') return 'text-inverse';
	if (variant && WHITE_TEXT_VARIANTS.has(variant)) return 'text-white';
	return 'text-primary';
}

/** Inline max-height custom property value when `maxHeight` is a CSS length or number. */
export function maxHeightStyle(maxHeight: Size | string | number | undefined): string | undefined {
	if (maxHeight === undefined || maxHeight === null) return undefined;
	if (typeof maxHeight === 'number') return `${maxHeight}px`;
	if (maxHeight.startsWith('h-')) return undefined;
	return maxHeight;
}
