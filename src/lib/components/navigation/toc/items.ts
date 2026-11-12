/** One heading in a table of contents. */
export interface TocItem {
	/** The `id` of the heading to scroll to. */
	id: string;
	/** The visible label. */
	label: string;
	/** The heading level, typically 2, 3 or 4. */
	level: number;
}
