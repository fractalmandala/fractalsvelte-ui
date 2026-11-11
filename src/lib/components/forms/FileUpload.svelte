<!-- @component Drag-and-drop file upload dropzone with file picker, multiple selection, and removable file list. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import { klFile, klUpload } from '$lib/icons/keylinestroke.js';
	import type { Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'files' | 'value'> {
		files?: File[];
		label?: string;
		hint?: string;
		accept?: string;
		maxSize?: number;
		multiple?: boolean;
		disabled?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		onfiles?: (files: File[]) => void;
		class?: string;
	}

	let {
		files = $bindable([]),
		label = 'Drop files here or browse',
		hint,
		accept,
		maxSize,
		multiple = true,
		disabled = false,
		surface = 'bg-surface',
		border = 'border-dashed',
		shape = 'modern',
		shadow = 'shad-none',
		textsize = 'text-md',
		onfiles,
		class: className = '',
		...restProps
	}: Props = $props();

	let over = $state(false);
	let error = $state('');

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / 1048576).toFixed(1)} MB`;
	};

	function handleAdd(incomingList: FileList | null) {
		if (!incomingList || disabled) return;
		let incoming = Array.from(incomingList);
		error = '';

		if (maxSize) {
			const oversized = incoming.filter((f) => f.size > maxSize);
			if (oversized.length > 0) {
				error = `${oversized.map((f) => f.name).join(', ')} exceed${oversized.length === 1 ? 's' : ''} ${formatSize(maxSize)}`;
				incoming = incoming.filter((f) => f.size <= maxSize);
			}
		}

		files = multiple ? [...files, ...incoming] : incoming.slice(0, 1);
		onfiles?.(files);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
		onfiles?.(files);
	}
</script>

<div class="box gap-xs wfull {textsize} {className}">
	<label
		class="field relative box xcenter ycenter gap-sm pad-lg {shape} {shadow} {over ? 'state-selected' : surface} {border} {disabled ? 'text-muted' : 'pointer'}"
		ondragover={(e) => {
			e.preventDefault();
			if (!disabled) over = true;
		}}
		ondragleave={() => (over = false)}
		ondrop={(e) => {
			e.preventDefault();
			over = false;
			if (!disabled) handleAdd(e.dataTransfer?.files ?? null);
		}}
	>
		<input
			{...restProps}
			type="file"
			{multiple}
			{accept}
			{disabled}
			class="sr-only"
			onchange={(e) => {
				handleAdd(e.currentTarget.files);
				e.currentTarget.value = '';
			}}
		/>
		<Icon icon={klUpload} size={24} class={disabled ? 'text-muted' : 'text-theme'} />
		<span class="weight-500 text-sm {disabled ? 'text-muted' : 'text-primary'}">{label}</span>
		{#if hint}
			<span class="text-xs text-secondary">{hint}</span>
		{/if}
	</label>
	{#if error}
		<p class="text-body-sm text-danger" role="alert">{error}</p>
	{/if}
	{#if files.length > 0}
		<ul class="box gap-xs">
			{#each files as f, i (f.name + i)}
				<li class="row ycenter xbetween gap-sm px-sm py-xs mincurved bg-surface text-xs text-primary">
					<div class="row ycenter gap-xs min0">
						<Icon icon={klFile} class="text-muted" />
						<span class="truncate weight-500">{f.name}</span>
						<span class="text-secondary shrink-0 tabular-nums">({formatSize(f.size)})</span>
					</div>
					<CloseButton label="Remove {f.name}" size="h-sm" onclick={() => removeFile(i)} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

