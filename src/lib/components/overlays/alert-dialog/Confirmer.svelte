<!-- @component A host that presents confirm() calls as alert dialogs. Mount one at the root of the app. -->

<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import AlertDialog from './AlertDialog.svelte';
	import { settleConfirm, subscribeConfirmer, type ConfirmRequest } from './confirm.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		/** Reserved for the host element; the confirmer itself has no visual props of its own. */
		class?: string;
	}

	let { class: klass, ...rest }: Props = $props();

	let request = $state<ConfirmRequest | null>(null);
	let settled = $state(false);

	$effect(() => {
		return subscribeConfirmer((next) => {
			request = next;
			settled = false;
		});
	});

	function resolve(value: boolean) {
		if (settled || !request) return;
		settled = true;
		settleConfirm(value);
	}
</script>

<AlertDialog
	open={request !== null}
	title={request?.options.title}
	description={request?.options.description}
	tone={request?.options.tone ?? 'neutral'}
	confirmLabel={request?.options.confirmLabel ?? 'Confirm'}
	cancelLabel={request?.options.cancelLabel ?? 'Cancel'}
	onConfirm={() => resolve(true)}
	onCancel={() => resolve(false)}
	onOpenChange={(next) => {
		if (!next) resolve(false);
	}}
	class={klass}
	{...rest}
/>
