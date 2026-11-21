<!-- @component Mounts and unmounts children with spring enter and exit transitions. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import { untrack } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  TransitionConfig  } from 'svelte/transition';
	import {
		springBlur,
		springFade,
		springFly,
		springScale,
		springSlide,
		type SpringInput,
		type SpringTransitionParams
	} from '../../../motion/index.js';

	type PresencePreset = 'fade' | 'scale' | 'fly-up' | 'fly-down' | 'fly-left' | 'fly-right' | 'blur' | 'slide';
	type PresenceMode = 'sync' | 'wait';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		show: boolean;
		enter?: PresencePreset;
		exit?: PresencePreset;
		spring?: SpringInput;
		mode?: PresenceMode;
		key?: string | number;
		onExitComplete?: () => void;
		children?: Snippet;
	}

	let {
		show,
		enter = 'fade',
		exit = 'fade',
		spring = 'snappy',
		mode = 'sync',
		key = undefined,
		onExitComplete,
		class: className,
		children,
		...rest
	}: Props = $props();

	function play(name: PresencePreset, node: Element, params: SpringTransitionParams): TransitionConfig {
		switch (name) {
			case 'fade':
				return springFade(node, params);
			case 'scale':
				return springScale(node, params);
			case 'fly-up':
				return springFly(node, { ...params, x: 0, y: 16 });
			case 'fly-down':
				return springFly(node, { ...params, x: 0, y: -16 });
			case 'fly-left':
				return springFly(node, { ...params, x: 16, y: 0 });
			case 'fly-right':
				return springFly(node, { ...params, x: -16, y: 0 });
			case 'blur':
				return springBlur(node, params);
			case 'slide':
				return springSlide(node, params);
		}
	}

	function enterTransition(node: Element, params: SpringTransitionParams & { preset: PresencePreset }): TransitionConfig {
		return play(params.preset, node, params);
	}

	function exitTransition(node: Element, params: SpringTransitionParams & { preset: PresencePreset }): TransitionConfig {
		return play(params.preset, node, params);
	}

	let visible = $state(false);
	let renderedKey = $state<string | number | undefined>(undefined);
	let pendingKey = $state<string | number | undefined>(undefined);
	let pendingShow = $state<boolean | null>(null);

	$effect.pre(() => {
		const nextShow = show;
		const nextKey = key;
		const wait = mode === 'wait';
		untrack(() => {
			if (!wait) {
				visible = nextShow;
				renderedKey = nextKey;
				pendingKey = undefined;
				pendingShow = null;
				return;
			}
			const keyChanging = nextKey !== renderedKey && nextKey !== pendingKey;
			if (keyChanging && (visible || pendingShow === true)) {
				pendingKey = nextKey;
				pendingShow = nextShow;
				if (visible) visible = false;
				return;
			}
			if (nextShow !== visible && pendingShow === null) {
				if (nextShow) {
					renderedKey = nextKey;
					visible = true;
				} else {
					visible = false;
				}
			}
		});
	});

	function handleExitEnd(): void {
		onExitComplete?.();
		if (pendingShow !== null || pendingKey !== undefined) {
			if (pendingKey !== undefined) renderedKey = pendingKey;
			visible = pendingShow ?? false;
			pendingKey = undefined;
			pendingShow = null;
		}
	}
</script>

{#key renderedKey}
	{#if visible}
		<div
			class={className}
			in:enterTransition={{ spring, preset: enter }}
			out:exitTransition={{ spring, preset: exit }}
			onoutroend={handleExitEnd}
			{...rest}
		>
			{@render children?.()}
		</div>
	{/if}
{/key}
