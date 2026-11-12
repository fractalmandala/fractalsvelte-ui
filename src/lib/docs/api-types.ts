/**
 * The shape of the GENERATED `src/lib/docs/generated/api.json` (written by
 * `scripts/gen.ts`) and `classes.json`. Shared by the scripts and the docs site.
 */

export interface ApiProp {
	name: string;
	/** The type as written, whitespace-normalised. */
	type: string;
	/** The literals of a string-literal union (after alias resolution), else null. */
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
	/** The `extends` clause (or intersected references) of `Props`, as written. */
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
	/** Value exports of `index.ts`. */
	exports: string[];
	/** Type-only exports of `index.ts`. */
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
