/** One suggestion, or a bare string that is its own label and value. */
export interface AutocompleteOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
}

/** Turn the shorthand form (`'harbor'`) into the full one. */
export function normalizeAutocompleteOptions(
	options: readonly (string | AutocompleteOption)[]
): AutocompleteOption[] {
	return options.map((opt) =>
		typeof opt === 'string' ? { value: opt, label: opt } : (opt as AutocompleteOption)
	);
}
