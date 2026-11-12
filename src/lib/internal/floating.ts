import type { Attachment } from 'svelte/attachments';

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
