export interface AutocompleteOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
}

export function normalizeAutocompleteOptions(
	options: readonly (string | AutocompleteOption)[]
): AutocompleteOption[] {
	return options.map((opt) =>
		typeof opt === 'string' ? { value: opt, label: opt } : (opt as AutocompleteOption)
	);
}
