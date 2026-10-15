<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		files?: File[];
		accept?: string;
		maxSize?: number;
		maxFiles?: number;
		multiple?: boolean;
		label?: string;
		description?: string;
		dropzoneText?: string;
		error?: boolean | string;
		disabled?: boolean;
		showFileList?: boolean;
		id?: string;
		class?: string;
	}

	let {
		files = $bindable([]),
		accept,
		maxSize,
		maxFiles,
		multiple = false,
		label,
		description,
		dropzoneText = 'Drag & drop files here, or click to browse',
		error,
		disabled = false,
		showFileList = true,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	let isDragging = $state(false);
	let localError: string | null = $state(null);

	const autoId = 'f-file-' + Math.random().toString(36).slice(2, 9);
	const fileId = $derived(id || autoId);

	const hasError = $derived(Boolean(error) || Boolean(localError));
	const displayError = $derived(
		localError || (typeof error === 'string' ? error : undefined)
	);

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
	}

	function validateAndAddFiles(newFiles: FileList | File[]) {
		localError = null;
		const validList: File[] = [];

		for (let i = 0; i < newFiles.length; i++) {
			const file = newFiles[i];

			if (maxSize && file.size > maxSize) {
				localError = `"${file.name}" exceeds the max file size of ${formatBytes(maxSize)}`;
				return;
			}

			if (accept) {
				const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
				const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
				const fileMime = file.type.toLowerCase();

				const isAccepted = acceptedTypes.some((type) => {
					if (type.startsWith('.')) {
						return fileExt === type;
					}
					if (type.endsWith('/*')) {
						return fileMime.startsWith(type.replace('/*', ''));
					}
					return fileMime === type;
				});

				if (!isAccepted) {
					localError = `"${file.name}" is not an accepted file type`;
					return;
				}
			}

			validList.push(file);
		}

		if (maxFiles && (files.length + validList.length) > maxFiles) {
			localError = `Maximum limit of ${maxFiles} file(s) reached`;
			return;
		}

		if (multiple) {
			files = [...files, ...validList];
		} else {
			files = validList.slice(0, 1);
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;
		if (disabled) return;
		if (e.dataTransfer?.files) {
			validateAndAddFiles(e.dataTransfer.files);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!disabled) isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			validateAndAddFiles(target.files);
			target.value = '';
		}
	}

	function removeFile(index: number) {
		if (disabled) return;
		files = files.filter((_, i) => i !== index);
		localError = null;
	}
</script>

<div
	class="f-file-container {className}"
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
	{...restProps}
>
	{#if label}
		<span class="f-file-label">{label}</span>
	{/if}

	{#if description}
		<span class="f-file-desc">{description}</span>
	{/if}

	<div
		class="f-file-dropzone"
		class:dragging={isDragging}
		tabindex={disabled ? -1 : 0}
		role="button"
		aria-label={dropzoneText}
		onclick={() => inputEl?.click()}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				inputEl?.click();
			}
		}}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
	>
		<input
			bind:this={inputEl}
			id={fileId}
			type="file"
			{accept}
			{multiple}
			{disabled}
			class="f-file-native-input"
			onchange={handleInputChange}
		/>

		<div class="f-file-dropzone-content">
			<div class="f-file-dropzone-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="17 8 12 3 7 8"></polyline>
					<line x1="12" y1="3" x2="12" y2="15"></line>
				</svg>
			</div>

			<div class="f-file-dropzone-text">
				<p class="f-file-prompt">{dropzoneText}</p>
				{#if accept || maxSize}
					<p class="f-file-constraints">
						{#if accept}{accept}{/if}
						{#if accept && maxSize} &bull; {/if}
						{#if maxSize}Up to {formatBytes(maxSize)}{/if}
					</p>
				{/if}
			</div>
		</div>
	</div>

	{#if displayError}
		<p class="f-file-error-msg" role="alert">{displayError}</p>
	{/if}

	{#if showFileList && files.length > 0}
		<ul class="f-file-list" aria-label="Selected files">
			{#each files as file, index}
				<li class="f-file-item">
					<div class="f-file-item-info">
						<svg class="f-file-doc-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
						</svg>
						<span class="f-file-name" title={file.name}>{file.name}</span>
						<span class="f-file-size">({formatBytes(file.size)})</span>
					</div>

					<button
						type="button"
						class="f-file-remove-btn"
						onclick={(e) => {
							e.stopPropagation();
							removeFile(index);
						}}
						aria-label={`Remove file ${file.name}`}
					>
						<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-file-container {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-file-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-file-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			margin-top: -2px;
		}

		.f-file-dropzone {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--f-space-xl) var(--f-space-lg);
			background: var(--f-surface);
			border: 1.5px dashed var(--f-border-strong);
			border-radius: var(--f-radius-lg);
			cursor: pointer;
			outline: none;
			text-align: center;
			transition: border-color var(--f-duration-fast) var(--f-ease),
				background-color var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-file-dropzone:hover:not(:disabled) {
			border-color: var(--f-primary);
			background: var(--f-sunken);
		}

		.f-file-dropzone.dragging {
			border-color: var(--f-primary);
			background: var(--f-primary-subtle);
		}

		.f-file-dropzone:focus-visible {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-file-native-input {
			display: none;
		}

		.f-file-dropzone-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--f-space-xs);
			pointer-events: none;
		}

		.f-file-dropzone-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: var(--f-primary);
		}

		.f-file-prompt {
			margin: 0;
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
		}

		.f-file-constraints {
			margin: 4px 0 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		/* File List */
		.f-file-list {
			list-style: none;
			margin: var(--f-space-2xs) 0 0;
			padding: 0;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
		}

		.f-file-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: var(--f-space-xs) var(--f-space-sm);
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-sm);
			gap: var(--f-space-sm);
		}

		.f-file-item-info {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			min-width: 0;
		}

		.f-file-doc-icon {
			color: var(--f-text-muted);
			flex-shrink: 0;
		}

		.f-file-name {
			font-size: var(--f-text-sm);
			color: var(--f-text);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.f-file-size {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			white-space: nowrap;
		}

		.f-file-remove-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: none;
			border: none;
			padding: 2px;
			color: var(--f-text-muted);
			border-radius: var(--f-radius-xs);
			cursor: pointer;
			flex-shrink: 0;
			transition: color var(--f-duration-fast) var(--f-ease);
		}

		.f-file-remove-btn:hover {
			color: var(--f-danger-text);
			background: var(--f-danger-bg);
		}

		/* Invalid state */
		.f-file-container[data-invalid='true'] .f-file-dropzone {
			border-color: var(--f-danger);
		}
		.f-file-error-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-danger-text);
			font-weight: 500;
		}

		/* Disabled */
		.f-file-container[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
		.f-file-container[data-disabled='true'] .f-file-dropzone {
			cursor: not-allowed;
			background: var(--f-sunken);
		}
	}
</style>
