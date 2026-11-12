<!-- @component A drag-and-drop zone with click-to-browse, a file list, and clear reasons when a file is rejected. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luFile, luUpload, luX } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import { useFieldControl } from '../field/field.js';

	interface Rejection {
		/** The file that was refused. */
		file: File;
		/** Why it was refused. */
		reason: string;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The accepted files. Bindable; works controlled and uncontrolled. */
		files?: File[];
		/** Called with the accepted list whenever it changes. */
		onFiles?: (files: File[]) => void;
		/** A native `accept` string — MIME types, `image/*` wildcards, or extensions such as `.pdf`. */
		accept?: string;
		/** Allows more than one file. When false, a new file replaces the current one. */
		multiple?: boolean;
		/** The largest file size in bytes. Larger files are rejected. */
		maxSize?: number;
		/** The most files the list may hold. Further files are rejected. */
		maxFiles?: number;
		/** Marks the drop zone invalid. Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** The contents of the drop zone, replacing the default prompt. */
		children?: Snippet;
	}

	let {
		files = $bindable([]),
		onFiles,
		accept,
		multiple = true,
		maxSize,
		maxFiles,
		invalid,
		id,
		class: klass,
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

<div class={['box gap-sm wfull', klass]} aria-invalid={control.invalid || undefined} {...rest}>
	<button
		type="button"
		id={control.id}
		class={[
			'bare box xcenter gap-sm wfull pad-lg radius-lg border-dashed pointer',
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
			<span class="row ycenter xcenter square h-xl radius-full state-selected text-theme">
				<Icon icon={luUpload} />
			</span>
			<span class="box xcenter gap-xs">
				<span class="weight-500">Drop files here or click to browse</span>
				<span class="text-sm text-muted">
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
		onchange={(event) => consider(Array.from(event.currentTarget.files ?? []))}
	/>
	{#if list.length}
		<ul id={listId} class="box gap-xs">
			{#each list as file, index (`${file.name}-${file.size}-${file.lastModified}`)}
				<li class="row ycenter gap-sm pad-sm radius-md border" transition:springScale={{ start: 0.96 }}>
					<span class="text-muted shrink-0"><Icon icon={luFile} /></span>
					<span class="box grow wmin0">
						<span class="truncate">{file.name}</span>
						<span class="text-xs text-muted tabular-nums">{formatSize(file.size)}</span>
					</span>
					<button
						type="button"
						class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"
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
				<li class="text-sm text-danger">{item.reason}</li>
			{/each}
		</ul>
	{/if}
</div>
