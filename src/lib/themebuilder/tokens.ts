export interface TokenMeta {
	key: string;
	label: string;
	category: 'surface' | 'typography' | 'border' | 'state' | 'accent';
	description: string;
	defaultVal: string;
}

export const CORE_TOKENS: TokenMeta[] = [
	{ key: 'white-fixed', label: 'Fixed White', category: 'surface', description: 'Constant pure white reference token', defaultVal: '#FFFFFF' },
	{ key: 'black-fixed', label: 'Fixed Black', category: 'surface', description: 'Constant deep black reference token', defaultVal: '#171717' },
	{ key: 'bg', label: 'App Canvas Base', category: 'surface', description: 'Deepest backdrop surface of the application', defaultVal: '#FAFAFA' },
	{ key: 'bg-surface', label: 'Card Surface', category: 'surface', description: 'Primary card and content container background', defaultVal: '#FAFAFA' },
	{ key: 'bg-raised', label: 'Raised Elements', category: 'surface', description: 'Elevated popovers, floating headers, tooltips', defaultVal: '#F4F4F5' },
	{ key: 'bg-panel', label: 'Sidebars & Panels', category: 'surface', description: 'Navbars, lateral sidebars, drawer panels', defaultVal: '#FBFBF9' },
	{ key: 'bg-sunken', label: 'Sunken Surface', category: 'surface', description: 'Deep inset containers, wells, footer areas', defaultVal: '#FFFFFF' },
	{ key: 'bg-popover', label: 'Popover & Modals', category: 'surface', description: 'Modal dialogs, popovers, popup menus', defaultVal: '#FAF7F7' },
	{ key: 'bg-button', label: 'Control Button Surface', category: 'surface', description: 'Interactive button and control fill', defaultVal: '#CED8D3' },
	{ key: 'bg-sidebar', label: 'Sidebar & Terminal Base', category: 'surface', description: 'Dark code blocks, terminals, tooltips, lateral sidebars', defaultVal: '#FAFAFA' },
	{ key: 'bg-input', label: 'Form Inputs', category: 'surface', description: 'Input fields, textareas, select boxes', defaultVal: '#FAF7F7' },
	{ key: 'bg-button-soft', label: 'Soft Button & Specimen', category: 'surface', description: 'Secondary subtle button background and specimen backdrop', defaultVal: '#F8FAFC' },
	{ key: 'border', label: 'Standard Border', category: 'border', description: 'Primary borders, card outlines, separators', defaultVal: '#d8d8d8' },
	{ key: 'border-subtle', label: 'Subtle Border', category: 'border', description: 'Faint divider lines and inner item borders', defaultVal: '#eceaea' },
	{ key: 'border-strong', label: 'Strong Border', category: 'border', description: 'High-contrast structural dividers and active borders', defaultVal: '#cfcfcf' },
	{ key: 'text-primary', label: 'Primary Text', category: 'typography', description: 'Headings, titles, high-contrast text', defaultVal: '#262627' },
	{ key: 'text-secondary', label: 'Secondary Text', category: 'typography', description: 'Body paragraphs, descriptions, labels', defaultVal: '#777777' },
	{ key: 'text-muted', label: 'Muted Text', category: 'typography', description: 'Captions, timestamps, metadata', defaultVal: '#aeaeae' },
	{ key: 'text-inverse', label: 'Inverse Text', category: 'typography', description: 'Contrast text on brand/accent buttons', defaultVal: '#ffffff' },
	{ key: 'state-hover', label: 'Hover State', category: 'state', description: 'Background tint on button and card hover', defaultVal: '#eae9e8' },
	{ key: 'state-selected', label: 'Selected State', category: 'state', description: 'Active tab, selected item highlight', defaultVal: '#eaeae9' },
	{ key: 'theme-color', label: 'Brand Accent', category: 'accent', description: 'Primary brand action color, active badges, highlights', defaultVal: '#FF3E00' },
	{ key: 'theme-color-alt', label: 'Accent Alternate', category: 'accent', description: 'Hover state for brand accent buttons', defaultVal: '#c84b21' },
	{ key: 'success', label: 'Success Status', category: 'accent', description: 'Success indicators, completed state, confirmations', defaultVal: '#10B981' },
	{ key: 'success-hover', label: 'Success Hover', category: 'accent', description: 'Interactive hover state for success elements', defaultVal: '#059669' },
	{ key: 'warning', label: 'Warning Status', category: 'accent', description: 'Warning alerts, cautionary indicators', defaultVal: '#F59E0B' },
	{ key: 'warning-hover', label: 'Warning Hover', category: 'accent', description: 'Interactive hover state for warning elements', defaultVal: '#D97706' },
	{ key: 'danger', label: 'Danger Status', category: 'accent', description: 'Destructive actions, error states, and critical alerts', defaultVal: '#EF4444' },
	{ key: 'danger-hover', label: 'Danger Hover', category: 'accent', description: 'Interactive hover state for destructive elements', defaultVal: '#DC2626' },
	{ key: 'info', label: 'Info Status', category: 'accent', description: 'Informational callouts and guide badges', defaultVal: '#3B82F6' },
	{ key: 'info-hover', label: 'Info Hover', category: 'accent', description: 'Interactive hover state for info elements', defaultVal: '#2563EB' },
	{ key: 'ring', label: 'Focus Ring', category: 'border', description: 'Keyboard accessibility focus outline', defaultVal: 'rgba(0, 127, 78, 0.35)' }
];
