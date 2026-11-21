<!-- @component A drag-and-drop zone with click-to-browse, a file list, and clear reasons when a file is rejected. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luFile, luUpload, luX } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import type { ChildTextSize, Gap, Pad, Shape, Size, Surface, TextColor, TextSize } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';

	interface Rejection {
		file: File;
		reason: string;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		files?: File[];
		onFiles?: (files: File[]) => void;
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		maxFiles?: number;
		showPreviews?: boolean;
		directory?: boolean;
		invalid?: boolean;
		size?: Size;
		gap?: Gap;
		shape?: Shape;
		surface?: Surface;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextSize?: ChildTextSize;
		children?: Snippet;
	}

	let {
		files = $bindable([]),
		onFiles,
		accept,
		multiple = true,
		maxSize,
		maxFiles,
		showPreviews = false,
		directory = false,
		invalid,
		size = 'h-xl',
		gap = 'gap-sm',
		shape = 'modern',
		surface = 'outlined',
		textSize = 'text-sm',
		textColor = 'text-muted',
		childTextSize = 'text-xs',
		id,
		class: className,
		children,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const listId = `${uid}-list`;
	const rejectId = `${uid}-reject`;
	const control = useFieldControl(uid, () => ({
		id,
		invalid,
		describedby: [describedby, list.length ? listId : null, rejections.length ? rejectId : null]
			.filter(Boolean)
			.join(' ') || null
	}));

	let over = $state(false);
	let rejections = $state<Rejection[]>([]);
	let input: HTMLInputElement | null = $state(null);
	let dragDepth = 0;

	const list = $derived(files ?? []);
	const dirAttrs = $derived(directory ? ({ webkitdirectory: '' } as Record<string, unknown>) : {});

	let previewUrls = $state(new Map<File, string>());
	$effect(() => {
		if (!showPreviews) {
			if (previewUrls.size === 0) return;
			for (const url of previewUrls.values()) URL.revokeObjectURL(url);
			previewUrls = new Map();
			return;
		}
		const next = new Map<File, string>();
		for (const file of list) {
			if (!file.type.startsWith('image/')) continue;
			next.set(file, previewUrls.get(file) ?? URL.createObjectURL(file));
		}
		let changed = next.size !== previewUrls.size;
		for (const [file, url] of previewUrls) {
			if (next.has(file)) continue;
			URL.revokeObjectURL(url);
			changed = true;
		}
		if (changed) previewUrls = next;
	});
	$effect(() => () => {
		for (const url of previewUrls.values()) URL.revokeObjectURL(url);
	});

	function formatSize(n: number): string {
		if (n < 1024) return `${n} B`;
		if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
		if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
		return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	}

	function matchesAccept(file: File): boolean {
		if (!accept) return true;
		const rules = accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
		if (!rules.length) return true;
		const name = file.name.toLowerCase();
		const type = file.type.toLowerCase();
		return rules.some((rule) => {
			if (rule.startsWith('.')) return name.endsWith(rule);
			if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
			return type === rule;
		});
	}

	function set(next: File[]): void {
		files = next;
		onFiles?.(next);
	}

	function consider(incoming: File[]): void {
		if (control.disabled) return;
		const rejected: Rejection[] = [];
		let next = multiple ? list.slice() : [];
		for (const file of incoming) {
			if (!matchesAccept(file)) {
				rejected.push({ file, reason: `${file.name} is not an accepted type.` });
				continue;
			}
			if (maxSize !== undefined && file.size > maxSize) {
				rejected.push({ file, reason: `${file.name} is larger than ${formatSize(maxSize)}.` });
				continue;
			}
			if (!multiple && next.length >= 1) {
				next = [file];
				continue;
			}
			if (maxFiles !== undefined && next.length >= maxFiles) {
				rejected.push({ file, reason: `At most ${maxFiles} files.` });
				continue;
			}
			next.push(file);
		}
		rejections = rejected;
		set(next);
		if (input) input.value = '';
	}

	function remove(index: number): void {
		if (control.disabled) return;
		set(list.filter((_, i) => i !== index));
	}

	function onDragEnter(event: DragEvent): void {
		if (control.disabled) return;
		if (!event.dataTransfer?.types.includes('Files')) return;
		event.preventDefault();
		dragDepth += 1;
		over = true;
	}

	function onDragOver(event: DragEvent): void {
		if (control.disabled) return;
		if (!event.dataTransfer?.types.includes('Files')) return;
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
		over = true;
	}

	function onDragLeave(event: DragEvent): void {
		event.preventDefault();
		dragDepth = Math.max(0, dragDepth - 1);
		if (dragDepth === 0) over = false;
	}

	function onDrop(event: DragEvent): void {
		event.preventDefault();
		dragDepth = 0;
		over = false;
		const incoming = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
		consider(incoming);
	}
</script>

<div class={['box', gap, 'wfull', className]} aria-invalid={control.invalid || undefined} {...rest}>
	<button
		type="button"
		id={control.id}
		class={[
			'bare box xcenter gap-sm wfull radius-lg border-dashed pointer',
			'pad-lg',
			over && 'drag-over',
			control.invalid && 'is-invalid',
			control.disabled && 'disabled'
		]}
		disabled={control.disabled}
		aria-describedby={control.describedby}
		aria-labelledby={control.labelId}
		onclick={() => input?.click()}
		ondragenter={onDragEnter}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		ondrop={onDrop}
	>
		{#if children}
			{@render children()}
		{:else}
			<span class={['row ycenter xcenter square radius-full state-selected text-theme', size]}>
				<Icon icon={luUpload} />
			</span>
			<span class="box xcenter gap-xs">
				<span class="weight-500">Drop files here or click to browse</span>
				<span class={[textSize, textColor]}>
					{#if accept || maxSize || maxFiles}
						{[
							accept,
							maxSize !== undefined ? `up to ${formatSize(maxSize)}` : null,
							maxFiles !== undefined ? `at most ${maxFiles} files` : null
						].filter(Boolean).join(' · ')}
					{:else}
						Any file type
					{/if}
				</span>
			</span>
		{/if}
	</button>
	<input
		bind:this={input}
		class="sr-only"
		type="file"
		{accept}
		multiple={multiple}
		disabled={control.disabled}
		tabindex="-1"
		aria-hidden="true"
		{...dirAttrs}
		onchange={(event) => consider(Array.from(event.currentTarget.files ?? []))}
	/>
	{#if list.length}
		<ul id={listId} class="box gap-xs">
			{#each list as file, index (`${file.name}-${file.size}-${file.lastModified}`)}
				{@const preview = previewUrls.get(file)}
				<li class={['row ycenter gap-sm pad-sm radius-md', surface]} transition:springScale={{ start: 0.96 }}>
					{#if preview}
						<img src={preview} alt="" class={['square fit-cover shrink-0 border-subtle', size, shape]} />
					{:else}
						<span class={[textColor, 'shrink-0']}><Icon icon={luFile} /></span>
					{/if}
					<span class="box grow wmin0">
						<span class="truncate">{file.name}</span>
						<span class={[childTextSize, 'tabular-nums', textColor]}>{formatSize(file.size)}</span>
					</span>
					<button
						type="button"
						class={['bare row ycenter xcenter shrink-0 square h-md radius-full hover-fill press', textColor]}
						aria-label={`Remove ${file.name}`}
						disabled={control.disabled}
						onclick={() => remove(index)}
					>
						<Icon icon={luX} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
	{#if rejections.length}
		<ul id={rejectId} class="box gap-xs">
			{#each rejections as item (`${item.file.name}-${item.reason}`)}
				<li class={[textSize, 'tone-danger text-theme']}>{item.reason}</li>
			{/each}
		</ul>
	{/if}
</div>
