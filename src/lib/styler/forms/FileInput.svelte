<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luUpload, luFile, luX } from 'fractalicons/lucide';

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

	const uid = $props.id();
	let inputEl: HTMLInputElement | null = $state(null);
	let dragging = $state(false);
	let localError: string | null = $state(null);
	const displayError = $derived(localError || (typeof error === 'string' ? error : undefined));

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${['B', 'KB', 'MB', 'GB'][i]}`;
	}

	function accepts(file: File): boolean {
		if (!accept) return true;
		const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
		const mime = file.type.toLowerCase();
		return accept
			.split(',')
			.map((t) => t.trim().toLowerCase())
			.some((t) => (t.startsWith('.') ? ext === t : t.endsWith('/*') ? mime.startsWith(t.slice(0, -1)) : mime === t));
	}

	function add(list: FileList | File[]) {
		localError = null;
		const valid: File[] = [];
		for (const file of Array.from(list)) {
			if (maxSize && file.size > maxSize) {
				localError = `"${file.name}" exceeds the max file size of ${formatBytes(maxSize)}`;
				return;
			}
			if (!accepts(file)) {
				localError = `"${file.name}" is not an accepted file type`;
				return;
			}
			valid.push(file);
		}
		if (maxFiles && files.length + valid.length > maxFiles) {
			localError = `Maximum limit of ${maxFiles} file(s) reached`;
			return;
		}
		files = multiple ? [...files, ...valid] : valid.slice(0, 1);
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (!disabled && e.dataTransfer?.files) add(e.dataTransfer.files);
	}
</script>

<div class="box gap-xs {className}" {...restProps}>
	{#if label}<label class="text-xs weight-500 text-secondary" for={id || uid}>{label}</label>{/if}
	{#if description}<span class="text-body-sm text-muted">{description}</span>{/if}

	<!-- The native input is kept and simply hidden (the HTML attribute, no CSS);
	     the dropzone forwards clicks and keys to it. -->
	<input
		bind:this={inputEl}
		id={id || uid}
		type="file"
		hidden
		{accept}
		{multiple}
		{disabled}
		onchange={(e) => {
			const t = e.currentTarget;
			if (t.files) add(t.files);
			t.value = '';
		}}
	/>
	<div
		class="card box xcenter gap-sm py-xl px-lg {dragging ? 'text-theme' : 'text-muted'}"
		data-variant={dragging ? 'link' : 'secondary'}
		data-shape="curved"
		tabindex={disabled ? -1 : 0}
		role="button"
		aria-disabled={disabled || undefined}
		aria-label={dropzoneText}
		onclick={() => !disabled && inputEl?.click()}
		onkeydown={(e) => {
			if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault();
				inputEl?.click();
			}
		}}
		{ondrop}
		ondragover={(e) => {
			e.preventDefault();
			if (!disabled) dragging = true;
		}}
		ondragleave={() => (dragging = false)}
	>
		<span class="text-2xl row ycenter" aria-hidden="true"><Icon icon={luUpload} /></span>
		<p class="text-body-sm text-primary">{dropzoneText}</p>
		{#if accept || maxSize}
			<p class="text-body-sm text-muted">
				{#if accept}{accept}{/if}{#if accept && maxSize}&nbsp;·&nbsp;{/if}{#if maxSize}Up to {formatBytes(maxSize)}{/if}
			</p>
		{/if}
	</div>

	{#if displayError}<p class="text-body-sm text-danger" role="alert">{displayError}</p>{/if}

	{#if showFileList && files.length > 0}
		<div role="list" class="box gap-xs" aria-label="Selected files">
			{#each files as file, index (file.name + index)}
				<div role="listitem" class="row ycenter xbetween gap-sm px-sm py-xs bg-sunken border-subtle radius-sm">
					<div class="row ycenter gap-xs min0">
						<Icon icon={luFile} class="text-muted shrink-0" />
						<span class="text-sm truncate" title={file.name}>{file.name}</span>
						<span class="text-sm text-muted shrink-0">({formatBytes(file.size)})</span>
					</div>
					<button
						type="button"
						data-variant="iconbox"
						class="px-xs text-muted"
						aria-label="Remove file {file.name}"
						{disabled}
						onclick={() => {
							files = files.filter((_, i) => i !== index);
							localError = null;
						}}
					>
						<Icon icon={luX} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
