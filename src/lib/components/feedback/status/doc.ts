import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Status',
	summary: 'A status dot with a label, for things like "Operational" or "Degraded".',
	description: `The status is a small, persistent indicator — the health of a region, the state of a service, whether a member is on call. The colour comes from the shared tone scale, and the meaning is always written next to the dot, never carried by colour alone.

A pulsing halo is for a live or degraded state that is still changing. It is a decoration, and is silent to assistive technology; the label is the announcement.`,
	features: [
		'Five tones, shared with the rest of the status vocabulary',
		'An optional pulsing halo',
		'Five sizes'
	],
	accessibility: [
		'The visible label is the accessible name; the dot and the halo are hidden from assistive technology.',
		'Do not rely on the tone alone — always pass a label such as "Operational" or "Degraded".'
	],
	related: ['alert', 'badge', 'banner']
});
