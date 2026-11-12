import type { IconData } from '@fractaldesign/icons';

/** One crumb in a Breadcrumbs trail. The last item is the current page. */
export interface BreadcrumbItem {
	/** The visible label. */
	label: string;
	/** A destination. Omit it on the current page, or on a crumb that is not a link. */
	href?: string;
	/** An icon drawn before the label. */
	icon?: IconData;
}
