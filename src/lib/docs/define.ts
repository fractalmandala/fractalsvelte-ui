export interface ComponentDoc {
	name: string;
	summary: string;
	description: string;
	parts?: Record<string, string>;
	features?: string[];
	accessibility: string[];
	keyboard?: { keys: string; action: string }[];
	api?: { name: string; type: string; description: string }[];
	related?: string[];
	status?: 'stable' | 'beta';
}

export function defineDoc(doc: ComponentDoc): ComponentDoc {
	return doc;
}
