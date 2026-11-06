<!-- @component Drag-and-drop file upload dropzone with file picker, multiple selection, and removable file list. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luUpload, luFile, luX } from '@fractaldesign/icons/lucide';
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
		border = 'border',
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

<div class="file-upload-root box gap-xs {textsize} {className}">
	<label
		class="dropzone box xcenter ycenter text-center {surface} {border} {shape} {shadow} {over ? 'is-dragover' : ''} {disabled ? 'is-disabled' : ''}"
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
			class="hidden-file-input"
			onchange={(e) => {
				handleAdd(e.currentTarget.files);
				e.currentTarget.value = '';
			}}
		/>

		<div class="upload-icon row xcenter ycenter text-theme" aria-hidden="true">
			<Icon icon={luUpload} />
		</div>

		<span class="upload-label font-medium text-sm text-primary">{label}</span>

		{#if hint}
			<span class="upload-hint text-xs text-secondary">{hint}</span>
		{/if}
	</label>

	{#if error}
		<span class="upload-error text-xs text-danger">{error}</span>
	{/if}

	{#if files.length > 0}
		<ul class="file-list box gap-xs list-none p0 m0">
			{#each files as f, i (f.name + i)}
				<li class="file-row row ycenter xbetween px-sm py-xs border radius-sm text-xs text-primary">
					<div class="row ycenter gap-xs min0">
						<Icon icon={luFile} />
						<span class="truncate font-medium">{f.name}</span>
						<span class="text-secondary shrink-0">({formatSize(f.size)})</span>
					</div>
					<button
						type="button"
						class="remove-btn text-secondary"
						aria-label="Remove {f.name}"
						onclick={() => removeFile(i)}
					>
						<Icon icon={luX} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.file-upload-root {
		width: 100%;
	}

	.dropzone {
		border-style: dashed;
		padding: 1.5rem 1rem;
		cursor: pointer;
		gap: 0.5rem;
		transition: border-color 150ms ease, background 150ms ease;
	}

	.dropzone.is-dragover {
		border-color: var(--theme-color, #22c55e);
		background: var(--state-surface, #f4f4f4);
	}

	.dropzone.is-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.hidden-file-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.upload-icon {
		font-size: 1.5rem;
	}

	.file-row {
		background: var(--bg-surface, #ffffff);
	}

	.remove-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.remove-btn:hover {
		color: var(--danger, #ef4444);
	}
</style>
