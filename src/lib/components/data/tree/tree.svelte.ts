import type { IconData } from '@fractaldesign/icons';

/** One node in a tree. */
export interface TreeItem {
	/** Stable unique id. */
	id: string;
	/** The visible label. */
	label: string;
	/** An optional leading icon. */
	icon?: IconData;
	/** Child nodes. Omit or leave empty for a leaf, unless `hasChildren` is set. */
	children?: TreeItem[];
	/** When true, the node cannot be selected, expanded or checked. */
	disabled?: boolean;
	/** When true, the node is expandable even if `children` have not been loaded yet. */
	hasChildren?: boolean;
}

/** A visible (expanded-path) node, with its depth and parent. */
export interface VisibleNode {
	item: TreeItem;
	level: number;
	parent: TreeItem | null;
}

/** Children of a node, preferring lazily loaded ones. */
export function childrenOf(item: TreeItem, loaded: Map<string, TreeItem[]>): TreeItem[] {
	return loaded.get(item.id) ?? item.children ?? [];
}

/** Whether the node can expand (has children, or can load them). */
export function isExpandable(
	item: TreeItem,
	loaded: Map<string, TreeItem[]>,
	canLoad: boolean
): boolean {
	if (item.disabled) return false;
	const kids = childrenOf(item, loaded);
	if (kids.length > 0) return true;
	if (item.hasChildren) return true;
	return canLoad && item.children === undefined && item.hasChildren !== false;
}

/** Walk the tree in document order, descending only into expanded nodes. */
export function flattenVisible(
	items: TreeItem[],
	expanded: Set<string>,
	loaded: Map<string, TreeItem[]>,
	canLoad: boolean
): VisibleNode[] {
	const out: VisibleNode[] = [];
	const walk = (nodes: TreeItem[], level: number, parent: TreeItem | null) => {
		for (const item of nodes) {
			out.push({ item, level, parent });
			if (expanded.has(item.id) && isExpandable(item, loaded, canLoad)) {
				walk(childrenOf(item, loaded), level + 1, item);
			}
		}
	};
	walk(items, 0, null);
	return out;
}

/** All descendant ids, depth-first. */
export function descendantIds(item: TreeItem, loaded: Map<string, TreeItem[]>): string[] {
	const out: string[] = [];
	const walk = (nodes: TreeItem[]) => {
		for (const child of nodes) {
			out.push(child.id);
			walk(childrenOf(child, loaded));
		}
	};
	walk(childrenOf(item, loaded));
	return out;
}

/** Find a node by id. */
export function findItem(
	items: TreeItem[],
	id: string,
	loaded: Map<string, TreeItem[]>
): TreeItem | null {
	for (const item of items) {
		if (item.id === id) return item;
		const found = findItem(childrenOf(item, loaded), id, loaded);
		if (found) return found;
	}
	return null;
}

/** Selected keys as a Set, whether the value is a single id or a Set. */
export function asSet(selected: string | Set<string> | null | undefined): Set<string> {
	if (selected == null) return new Set();
	if (selected instanceof Set) return selected;
	return new Set([selected]);
}

/**
 * Toggle a node and propagate to descendants and ancestors.
 * Checking a parent checks every descendant; a parent is checked when every child is.
 */
export function toggleChecked(
	checked: Set<string>,
	item: TreeItem,
	items: TreeItem[],
	loaded: Map<string, TreeItem[]>,
	on: boolean
): Set<string> {
	const next = new Set(checked);
	const apply = (node: TreeItem, value: boolean) => {
		if (value) next.add(node.id);
		else next.delete(node.id);
		for (const child of childrenOf(node, loaded)) apply(child, value);
	};
	apply(item, on);

	const syncAncestors = (nodes: TreeItem[], parent: TreeItem | null): boolean => {
		let found = false;
		for (const node of nodes) {
			if (node.id === item.id || syncAncestors(childrenOf(node, loaded), node)) {
				found = true;
				if (parent) {
					const kids = childrenOf(parent, loaded);
					const all = kids.length > 0 && kids.every((child) => next.has(child.id));
					if (all) next.add(parent.id);
					else next.delete(parent.id);
				}
			}
		}
		return found;
	};
	syncAncestors(items, null);
	return next;
}

/** The checkbox state of a node, after descendant propagation. */
export function checkState(
	item: TreeItem,
	checked: Set<string>,
	loaded: Map<string, TreeItem[]>
): 'checked' | 'unchecked' | 'mixed' {
	if (checked.has(item.id)) return 'checked';
	const kids = childrenOf(item, loaded);
	if (kids.length === 0) return 'unchecked';
	let sawChecked = false;
	let sawUnchecked = false;
	for (const child of kids) {
		const state = checkState(child, checked, loaded);
		if (state === 'mixed') return 'mixed';
		if (state === 'checked') sawChecked = true;
		else sawUnchecked = true;
		if (sawChecked && sawUnchecked) return 'mixed';
	}
	if (sawChecked && !sawUnchecked) return 'checked';
	return 'unchecked';
}
