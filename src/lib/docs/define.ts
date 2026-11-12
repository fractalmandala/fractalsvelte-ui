/** The documentation manifest of one component folder. See AGENTS.md, Law 2. */
export interface ComponentDoc {
	/** The primary export, PascalCase — `Button`. */
	name: string;
	/** One sentence. Shown in the index and the page header. */
	summary: string;
	/** One to three paragraphs. A blank line starts a new paragraph; `code` is allowed. */
	description: string;
	/** Every non-primary component export → one line on what it is for. */
	parts?: Record<string, string>;
	/** Short capability bullets. */
	features?: string[];
	/** How the component is accessible — at least one statement. */
	accessibility: string[];
	/** Keyboard interactions, when the component is interactive. */
	keyboard?: { keys: string; action: string }[];
	/** Non-component exports: functions, attachments, classes, stores. */
	api?: { name: string; type: string; description: string }[];
	/** Slugs of related components. */
	related?: string[];
	status?: 'stable' | 'beta';
}

export function defineDoc(doc: ComponentDoc): ComponentDoc {
	return doc;
}
