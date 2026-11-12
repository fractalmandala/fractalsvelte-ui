/** The kits, in documentation order. A kit is a folder in `src/lib/components`. */
export interface Kit {
	id: string;
	title: string;
	description: string;
}

export const kits: Kit[] = [
	{ id: 'actions', title: 'Actions', description: 'Buttons, toggles and the things people press.' },
	{ id: 'inputs', title: 'Inputs', description: 'Text entry — fields, text areas, numbers, pins, tags, files.' },
	{ id: 'selection', title: 'Selection', description: 'Checkboxes, radios, switches, sliders, ratings, segments.' },
	{ id: 'pickers', title: 'Pickers', description: 'Select, combobox, calendar, date and colour pickers.' },
	{ id: 'overlays', title: 'Overlays', description: 'Dialogs, drawers, popovers, tooltips, menus, command palette.' },
	{ id: 'navigation', title: 'Navigation', description: 'Tabs, breadcrumbs, pagination, steppers, docks, sidebars.' },
	{ id: 'feedback', title: 'Feedback', description: 'Alerts, toasts, progress, skeletons, empty states.' },
	{ id: 'display', title: 'Display', description: 'Cards, avatars, stats, code — the surfaces content sits on.' },
	{ id: 'primitives', title: 'Primitives', description: 'Badges, tags, keys, dividers — the small parts.' },
	{ id: 'data', title: 'Data', description: 'Tables, data grids, trees, accordions, timelines, carousels.' },
	{ id: 'layout', title: 'Layout', description: 'Resizable panes, bento and masonry grids, scroll areas.' },
	{ id: 'motion', title: 'Motion', description: 'Spring-driven primitives: presence, reveal, drag, reorder, text.' },
	{ id: 'effects', title: 'Effects', description: 'Spotlights, beams, auroras, patterns, glass.' },
	{ id: 'theme', title: 'Theme', description: 'Mode, theme and live customisation controls.' }
];
