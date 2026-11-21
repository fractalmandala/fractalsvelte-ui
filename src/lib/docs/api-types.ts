export interface ApiProp {
	name: string;
	type: string;
	resolvedValues: string[] | null;
	optional: boolean;
	bindable: boolean;
	default: string | null;
	description: string;
	snippet: boolean;
}

export interface ApiPart {
	name: string;
	file: string;
	inherits: string[];
	props: ApiProp[];
}

export interface ApiExample {
	file: string;
	title: string;
	description: string;
}

export interface ApiComponent {
	kit: string;
	slug: string;
	name: string;
	summary: string;
	description: string;
	doc?: Record<string, unknown>;
	exports: string[];
	typeExports: string[];
	parts: ApiPart[];
	examples: ApiExample[];
}

export interface ApiJson {
	generated: string;
	components: ApiComponent[];
}

export interface LayerClass {
	class: string;
	file: string;
	selector: string;
	declarations: string;
}
