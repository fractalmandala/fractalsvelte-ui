import { createContext } from 'svelte';
import type { Orientation } from '../../../internal/tokens.js';

/** What a pane tells its group about itself. Getters keep the values live. */
export interface PaneEntry {
	readonly id: string;
	readonly defaultSize: number | undefined;
	readonly minSize: number;
	readonly maxSize: number;
	readonly collapsible: boolean;
	readonly collapsedSize: number;
	/** The pane element — set once mounted; used to keep panes in document order. */
	el: HTMLElement | undefined;
}

const EPS = 0.01;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const sum = (a: number[]) => a.reduce((t, v) => t + v, 0);

/** The lowest size a pane may rest at: its collapsed size if it can collapse, else its minimum. */
const floor = (p: PaneEntry) => (p.collapsible ? Math.min(p.collapsedSize, p.minSize) : p.minSize);

/** Whether a size means the pane is collapsed. */
const isCollapsedSize = (p: PaneEntry, v: number) => p.collapsible && p.collapsedSize < p.minSize && v <= p.collapsedSize + EPS;

/** Bring one size into a pane's allowed set: collapsed, or within [min, max]. */
function fitOne(p: PaneEntry, v: number): number {
	if (isCollapsedSize(p, v)) return p.collapsedSize;
	return clamp(v, p.minSize, Math.max(p.minSize, p.maxSize));
}

/** Resolve a drag/keyboard target for a pane, collapsing past the halfway point to the collapsed size. */
function snap(p: PaneEntry, v: number): number {
	if (p.collapsible && v < p.minSize) return v < (p.minSize + p.collapsedSize) / 2 ? p.collapsedSize : p.minSize;
	return clamp(v, p.minSize, Math.max(p.minSize, p.maxSize));
}

/** Make a set of sizes honour every pane's limits and total exactly 100. */
function fit(panes: PaneEntry[], raw: number[]): number[] {
	const s = raw.map((v, i) => fitOne(panes[i], v));
	for (let pass = 0; pass < 6; pass++) {
		const delta = 100 - sum(s);
		if (Math.abs(delta) < EPS / 10) break;
		const open = s
			.map((v, i) => i)
			.filter((i) => (delta > 0 ? s[i] < panes[i].maxSize - EPS : s[i] > panes[i].minSize + EPS && !isCollapsedSize(panes[i], s[i])));
		if (open.length === 0) break;
		for (const i of open) s[i] = fitOne(panes[i], s[i] + delta / open.length);
	}
	return s;
}

/** Sizes from the explicit overrides, then each pane's default, then an equal share of what is left. */
function resolve(panes: PaneEntry[], overrides: Record<string, number>): number[] {
	if (panes.length === 0) return [];
	const raw = panes.map((p) => overrides[p.id] ?? p.defaultSize ?? NaN);
	const unset = raw.filter((v) => Number.isNaN(v)).length;
	const known = sum(raw.filter((v) => !Number.isNaN(v)));
	const share = unset > 0 ? Math.max(0, 100 - known) / unset : 0;
	const filled = raw.map((v) => (Number.isNaN(v) ? share : v));
	const total = sum(filled);
	const scaled = total > 0 && Math.abs(total - 100) > EPS ? filled.map((v) => (v / total) * 100) : filled;
	return fit(panes, scaled);
}

/** The state shared by a `Resizable` group, its panes and its handles. */
export class ResizableState {
	panes = $state.raw<PaneEntry[]>([]);
	overrides = $state.raw<Record<string, number>>({});
	/** A pointer is dragging a handle — panes follow it directly instead of springing. */
	dragging = $state(false);
	/** The user has moved something (as opposed to the sizes being defaults or seeded). */
	touched = $state(false);
	root: HTMLElement | undefined;
	private handles = 0;
	private restore = new Map<string, number>();

	constructor(private readonly read: { orientation: () => Orientation }) {}

	get orientation(): Orientation {
		return this.read.orientation();
	}

	/** The current sizes, in percent, in document order. */
	sizes = $derived.by(() => resolve(this.panes, this.overrides));
	/** The sizes with no user input. */
	defaults = $derived.by(() => resolve(this.panes, {}));

	register(entry: PaneEntry): () => void {
		this.panes = [...this.panes, entry];
		return () => {
			this.panes = this.panes.filter((p) => p !== entry);
		};
	}

	/** Re-order panes by their position in the document (after a pane mounts late). */
	sort(): void {
		const order = [...this.panes].sort((a, b) =>
			a.el && b.el ? (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1) : 0
		);
		this.panes = order;
	}

	/** The ordinal of a handle at registration — the fallback until it can read its place in the DOM. */
	nextHandle(): number {
		return this.handles++;
	}

	indexOf(id: string): number {
		return this.panes.findIndex((p) => p.id === id);
	}

	sizeOf(id: string): number | undefined {
		return this.sizes[this.indexOf(id)];
	}

	isCollapsed(id: string): boolean {
		const i = this.indexOf(id);
		return i >= 0 && isCollapsedSize(this.panes[i], this.sizes[i] ?? 100);
	}

	/** The pane before the handle at this gap, and the size/limits a separator reports. */
	describe(index: number): { id: string | undefined; now: number; min: number; max: number } {
		const p = this.panes[index];
		if (!p) return { id: undefined, now: 0, min: 0, max: 100 };
		return { id: p.id, now: this.sizes[index] ?? 0, min: floor(p), max: Math.min(100, p.maxSize) };
	}

	/** Seed sizes (a bound value or storage) without counting as user input. */
	seed(next: number[]): void {
		if (next.length !== this.panes.length) return;
		this.overrides = Object.fromEntries(this.panes.map((p, i) => [p.id, next[i]]));
	}

	/** Record sizes the user chose. */
	apply(next: number[]): void {
		this.seed(next);
		this.touched = true;
	}

	/** Pixels available to panes along the group's axis (the group minus its handles). */
	available(): number {
		const root = this.root;
		if (!root) return 1;
		const horizontal = this.orientation === 'horizontal';
		const total = horizontal ? root.clientWidth : root.clientHeight;
		const taken = Array.from(root.children)
			.filter((c) => c.getAttribute('role') === 'separator')
			.reduce((t, c) => t + (horizontal ? (c as HTMLElement).offsetWidth : (c as HTMLElement).offsetHeight), 0);
		return Math.max(1, total - taken);
	}

	/** Sizes after moving the handle at `index` by `delta` percent from `base`. */
	move(base: number[], index: number, delta: number): number[] {
		const a = this.panes[index];
		const b = this.panes[index + 1];
		if (!a || !b) return base;
		const total = base[index] + base[index + 1];
		let na = snap(a, base[index] + delta);
		let nb = snap(b, total - na);
		na = total - nb;
		na = clamp(na, floor(a), a.maxSize);
		nb = clamp(total - na, floor(b), b.maxSize);
		na = total - nb;
		const next = [...base];
		next[index] = na;
		next[index + 1] = nb;
		return next;
	}

	/** Move the handle at `index` by `delta` percent from where it is now. */
	resizeBy(index: number, delta: number): void {
		this.apply(this.move(this.sizes, index, delta));
	}

	/** Put the pane before the handle at `index` at its smallest or largest size. */
	jump(index: number, to: 'min' | 'max'): void {
		this.resizeBy(index, to === 'min' ? -100 : 100);
	}

	/** Return the two panes around a handle to their default proportions. */
	reset(index: number): void {
		const d = this.defaults;
		const s = this.sizes;
		if (index < 0 || index + 1 >= s.length) return;
		const total = s[index] + s[index + 1];
		const na = (d[index] / (d[index] + d[index + 1])) * total;
		const next = [...s];
		next[index] = na;
		next[index + 1] = total - na;
		this.apply(next);
	}

	/** Collapse or expand a pane, springing its neighbour to take or give the space. */
	setCollapsed(id: string, want: boolean): void {
		const i = this.indexOf(id);
		if (i < 0 || this.panes.length < 2 || this.isCollapsed(id) === want) return;
		const j = i < this.panes.length - 1 ? i + 1 : i - 1;
		const p = this.panes[i];
		if (want && !p.collapsible) return;
		const s = this.sizes;
		let size: number;
		if (want) {
			this.restore.set(id, s[i]);
			size = p.collapsedSize;
		} else {
			size = clamp(this.restore.get(id) ?? p.defaultSize ?? p.minSize, p.minSize, p.maxSize);
		}
		const total = s[i] + s[j];
		const next = [...s];
		next[i] = size;
		next[j] = total - size;
		this.apply(next);
	}

	/** Toggle whichever pane around a handle can collapse (an already-collapsed one opens first). */
	toggleAt(index: number): void {
		const pair = [this.panes[index], this.panes[index + 1]].filter((p): p is PaneEntry => p !== undefined);
		const target = pair.find((p) => this.isCollapsed(p.id)) ?? pair.find((p) => p.collapsible);
		if (target) this.setCollapsed(target.id, !this.isCollapsed(target.id));
	}
}

export const [getResizable, setResizable] = createContext<ResizableState>();
