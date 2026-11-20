// Family-local port of @zag-js/json-tree-utils 1.48.0 (json-to-tree, node-conversion,
// data-type, accessibility). The DOM-flavoured data types (element, document, window, blob, file,
// headers, formdata, url, arraybuffer, dataview, weak collections, iterables, typed arrays, react
// elements, node buffers) are left out; everything a JSON or plain JavaScript value needs is here.

/** A path from the root of the inspected value: keys and indices. */
export type JsonKeyPath = (string | number)[];

/** How much of a value a collapsed row shows. */
export interface JsonNodePreviewOptions {
	/** How many items a preview lists before it trails off. */
	maxPreviewItems: number;
	/** Strings longer than this are cut with an ellipsis. */
	collapseStringsAfterLength: number;
	/** Arrays longer than this are grouped into ranges. */
	groupArraysAfterLength: number;
	/** Also list non-enumerable own properties. */
	showNonenumerable: boolean;
}

export type JsonNodeType =
	| 'object'
	| 'array'
	| 'string'
	| 'number'
	| 'boolean'
	| 'null'
	| 'undefined'
	| 'symbol'
	| 'bigint'
	| 'function'
	| 'error'
	| 'date'
	| 'regex'
	| 'set'
	| 'map'
	| 'circular';

/** One row of the tree. */
export interface JsonNode {
	/** The inspected value at this path. */
	value: unknown;
	type: JsonNodeType;
	keyPath: JsonKeyPath;
	children?: JsonNode[];
	constructorName?: string;
	/** True for a property that would not show in `Object.keys` — the row is dimmed. */
	isNonEnumerable?: boolean;
	propertyDescriptor?: PropertyDescriptor;
}

/** The little element tree a preview renders into. */
export interface JsonElement {
	type: 'text' | 'element';
	value?: string;
	tagName?: string;
	properties: Record<string, unknown>;
	children: JsonElement[];
}

const DEFAULT_PREVIEW_OPTIONS: JsonNodePreviewOptions = {
	maxPreviewItems: 3,
	collapseStringsAfterLength: 30,
	groupArraysAfterLength: 100,
	showNonenumerable: true
};

export { DEFAULT_PREVIEW_OPTIONS };

export function getPreviewOptions(options?: Partial<JsonNodePreviewOptions>): JsonNodePreviewOptions {
	const resolved: JsonNodePreviewOptions = { ...DEFAULT_PREVIEW_OPTIONS };

	if (!options) return resolved;

	for (const key of Object.keys(resolved) as (keyof JsonNodePreviewOptions)[]) {
		const value = options[key];

		if (value !== undefined) (resolved as unknown as Record<string, unknown>)[key] = value;
	}

	return resolved;
}

const ROOT_KEY = '$';
const MAX_DEPTH = 20;
const ENTRIES_KEY = '[[Entries]]';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

const asArray = (value: unknown): unknown[] => value as unknown[];
const asSet = (value: unknown): Set<unknown> => value as Set<unknown>;
const asMap = (value: unknown): Map<unknown, unknown> => value as Map<unknown, unknown>;
const asString = (value: unknown): string => value as string;

function hash(value: string): string {
	const text = value.replace(/\r/g, '');
	let result = 5381;
	let index = text.length;

	while (index--) result = ((result << 5) - result) ^ text.charCodeAt(index);

	return (result >>> 0).toString(36);
}

/** Is this path the synthetic root (`['$']`)? */
export function isRootKeyPath(keyPath: JsonKeyPath): boolean {
	return keyPath.length === 1 && keyPath[0] === ROOT_KEY;
}

/** The DOM id of a row: its path joined with dots. */
export function keyPathToId(keyPath: JsonKeyPath): string {
	return keyPath.join('.');
}

/** The label of a row: its last key, or `''` for the root. */
export function keyPathToKey(
	keyPath: JsonKeyPath,
	opts?: { excludeRoot?: boolean }
): string {
	if (keyPath.length === 0) return '';
	if (opts?.excludeRoot && isRootKeyPath(keyPath)) return '';

	return String(keyPath[keyPath.length - 1]);
}

/** A stable short id for a row, used for expansion state. */
export function nodeToValue(node: JsonNode): string {
	return hash(keyPathToId(node.keyPath));
}

/** The human label of a row. */
export function nodeToString(node: JsonNode): string {
	return keyPathToKey(node.keyPath) || 'root';
}

/** The tree's single root row, wrapping `data`. */
export function getRootNode(data: unknown, opts?: Partial<JsonNodePreviewOptions>): JsonNode {
	return {
		value: '',
		type: 'object',
		keyPath: [],
		children: [
			jsonToTree(data, {
				visited: new WeakSet(),
				keyPath: [ROOT_KEY],
				options: getPreviewOptions(opts)
			})
		]
	};
}

interface JsonToTreeProps {
	visited?: WeakSet<object>;
	keyPath?: JsonKeyPath;
	depth?: number;
	options?: JsonNodePreviewOptions;
}

interface JsonTypeContext {
	value: unknown;
	keyPath: JsonKeyPath;
	options: JsonNodePreviewOptions;
	createNode: (nestedKeyPath: JsonKeyPath, value: unknown) => JsonNode;
}

interface JsonDataType {
	type: JsonNodeType | ((value: unknown) => JsonNodeType);
	description: string | ((node: JsonNode, opts: JsonNodePreviewOptions) => string);
	check: (value: unknown) => boolean;
	previewElement: (node: JsonNode, opts: JsonNodePreviewOptions) => JsonElement;
	previewText?: (node: JsonNode, opts: JsonNodePreviewOptions) => string;
	node: (ctx: JsonTypeContext) => JsonNode;
}

/** Walk `data` into rows, depth-first, guarding against cycles and runaway depth. */
export function jsonToTree(data: unknown, props: JsonToTreeProps = {}): JsonNode {
	const { visited = new WeakSet<object>(), keyPath = [ROOT_KEY], depth = 0 } = props;
	const options = props.options ?? DEFAULT_PREVIEW_OPTIONS;

	if (depth > MAX_DEPTH) return { value: '[Max Depth Reached]', type: 'string', keyPath };

	if (isRecord(data)) {
		if (visited.has(data)) return { value: '[Circular Reference]', type: 'circular', keyPath };
		visited.add(data);
	}

	const dataType = dataTypes.find((entry) => entry.check(data)) ?? PrimitiveType;

	return dataType.node({
		value: data,
		keyPath,
		options,
		createNode: (nestedKeyPath, value) =>
			jsonToTree(value, {
				visited,
				keyPath: [...keyPath, ...nestedKeyPath],
				options,
				depth: depth + 1
			})
	});
}

const txt = (value: string): JsonElement => ({
	type: 'text',
	value,
	properties: {},
	children: []
});

const jsx = (
	tagName: string,
	properties: Record<string, unknown> = {},
	children: JsonElement[] = []
): JsonElement => ({ type: 'element', tagName, properties, children });

const generatePreviewText = (items: string[], hasMore: boolean): string =>
	` ${items.join(', ')}${hasMore ? ', … ' : ' '}`;

function formatValue(value: unknown): string {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'string') return `"${value}"`;
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	if (value instanceof Date) return value.toISOString();
	if (value instanceof Set) return `Set(${value.size})`;
	if (value instanceof Map) return `Map(${value.size})`;
	if (Array.isArray(value)) return `Array(${value.length})`;
	if (typeof value === 'object') return 'Object';

	return String(value);
}

function formatValueMini(child: JsonNode): string {
	if (child.type === 'string') return `"${child.value}"`;
	if (child.type === 'null') return 'null';
	if (child.type === 'undefined' || child.type === 'symbol') return 'undefined';
	if (child.type === 'object') return '{…}';
	if (child.type === 'array') return '[…]';
	if (child.type === 'set') return 'Set(…)';
	if (child.type === 'map') return 'Map(…)';
	if (child.type === 'function') return 'ƒ(…)';

	return String(child.value);
}

const dataType = (entry: JsonDataType): JsonDataType => entry;

const NullType = dataType({
	type: 'null',
	description: 'null',
	check: (value) => value === null,
	previewElement: () => jsx('span', {}, [txt('null')]),
	node: ({ value, keyPath }) => ({ value, type: 'null', keyPath })
});

const UndefinedType = dataType({
	type: 'undefined',
	description: 'undefined',
	check: (value) => value === undefined,
	previewElement: () => jsx('span', {}, [txt('undefined')]),
	node: ({ value, keyPath }) => ({ value, type: 'undefined', keyPath })
});

const SymbolType = dataType({
	type: 'symbol',
	description: (node) => String(node.value),
	check: (value) => typeof value === 'symbol',
	previewElement: (node) => jsx('span', {}, [txt(String(node.value))]),
	node: ({ value, keyPath }) => ({ value, type: 'symbol', keyPath })
});

const BigIntType = dataType({
	type: 'bigint',
	description: (node) => `${node.value}n`,
	check: (value) => typeof value === 'bigint',
	previewElement: (node) => jsx('span', {}, [txt(`${node.value}n`)]),
	node: ({ value, keyPath }) => ({ value, type: 'bigint', keyPath })
});

function getFunctionString(fn: (...args: never[]) => unknown): string {
	try {
		return fn.toString();
	} catch {
		return 'function () {}';
	}
}

const FUNCTION_SIGNATURE_REGEX = /(?:async\s+)?(?:function\s*\*?\s*)?([^(]*\([^)]*\))/;

function getFunctionSignature(fn: (...args: never[]) => unknown): string {
	const match = getFunctionString(fn).match(FUNCTION_SIGNATURE_REGEX);

	return match ? match[1] : `${fn.name || 'anonymous'}()`;
}

const FunctionType = dataType({
	type: 'function',
	description: (node) => {
		const fn = node.value as (...args: never[]) => unknown;
		const name = fn.name || 'anonymous';

		switch (fn.constructor.name) {
			case 'AsyncFunction':
				return `async ƒ ${name}()`;
			case 'AsyncGeneratorFunction':
				return `async ƒ* ${name}()`;
			case 'GeneratorFunction':
				return `ƒ* ${name}()`;
			default:
				return `ƒ ${name}()`;
		}
	},
	check: (value) => typeof value === 'function',
	previewElement: (node) => {
		const signature = getFunctionSignature(node.value as (...args: never[]) => unknown);
		const preview = signature.length > 50 ? `${signature.substring(0, 47)}...` : signature;

		return jsx('span', {}, [
			jsx('span', { kind: 'function-type' }, [txt('ƒ ')]),
			jsx('span', { kind: 'function-body' }, [txt(preview)])
		]);
	},
	node: ({ value, keyPath, createNode }) => {
		const fn = value as (...args: never[]) => unknown;
		const ownKeys = Object.getOwnPropertyNames(fn).filter(
			(key) => !['name', 'length', 'prototype', 'caller', 'arguments'].includes(key)
		);
		const children = [
			createNode(['name'], fn.name || 'anonymous'),
			createNode(['length'], fn.length),
			createNode(['constructor'], fn.constructor.name),
			...ownKeys.map((key) => createNode([key], Reflect.get(fn, key)))
		];

		return { value, type: 'function', keyPath, children };
	}
});

const ErrorType = dataType({
	type: 'error',
	description: (node) => {
		const error = node.value as Error;

		return `${error.name}: ${error.message}`;
	},
	check: (value) => value instanceof Error,
	previewElement: (node) => {
		const error = node.value as Error;

		return jsx('span', {}, [
			jsx('span', { kind: 'constructor' }, [txt(error.name)]),
			jsx('span', { kind: 'colon' }, [txt(': ')]),
			jsx('span', {}, [txt(error.message)])
		]);
	},
	node: ({ value, keyPath, createNode }) => {
		const error = value as Error;
		const known = ['name', 'message', 'stack'];
		const extra = Object.getOwnPropertyNames(error).filter((key) => !known.includes(key));

		return {
			value,
			keyPath,
			type: 'error',
			children: [...known, ...extra].map((key) => createNode([key], Reflect.get(error, key)))
		};
	}
});

const DateType = dataType({
	type: 'date',
	description: (node) => String(node.value),
	check: (value) => value instanceof Date,
	previewElement: (node) => jsx('span', {}, [txt((node.value as Date).toISOString())]),
	node: ({ value, keyPath }) => ({ value, type: 'date', keyPath })
});

const RegexType = dataType({
	type: 'regex',
	description: (node) => String(node.value),
	check: (value) => value instanceof RegExp,
	previewElement: (node) => jsx('span', {}, [txt(String(node.value))]),
	node: ({ value, keyPath, createNode }) => ({
		value,
		type: 'regex',
		keyPath,
		children: ['source', 'flags', 'lastIndex'].map((key) =>
			createNode([key], Reflect.get(value as RegExp, key))
		)
	})
});

const SetType = dataType({
	type: 'set',
	description: (node) => `Set(${asSet(node.value).size})`,
	check: (value) => value instanceof Set,
	previewText: (node, opts) => {
		const entries = Array.from(asSet(node.value));
		const values = entries.slice(0, opts.maxPreviewItems).map(formatValue);

		return generatePreviewText(values, entries.length > opts.maxPreviewItems);
	},
	previewElement: (node, opts) => {
		const preview = SetType.previewText?.(node, opts) ?? '';
		const children = [
			jsx('span', { kind: 'constructor' }, [txt(`Set(${asSet(node.value).size})`)]),
			jsx('span', { kind: 'brace' }, [txt(' {')])
		];

		if (preview) children.push(jsx('span', { kind: 'preview-text' }, [txt(preview)]));
		children.push(jsx('span', { kind: 'brace' }, [txt('}')]));

		return jsx('span', {}, children);
	},
	node: ({ value, keyPath, createNode }) => ({
		type: 'set',
		value,
		keyPath,
		children: [
			{
				value: Array.from(asSet(value)),
				keyPath: [...keyPath, ENTRIES_KEY],
				type: 'array',
				children: Array.from(asSet(value)).map((item, index) =>
					createNode([ENTRIES_KEY, index], item)
				),
				isNonEnumerable: true
			},
			createNode(['size'], asSet(value).size)
		]
	})
});

const MapType = dataType({
	type: 'map',
	description: (node) => `Map(${asMap(node.value).size})`,
	check: (value) => value instanceof Map,
	previewText: (node, opts) => {
		const entries = Array.from(asMap(node.value).entries());
		const previews = entries.slice(0, opts.maxPreviewItems).map(([key, value]) => {
			const keyText = typeof key === 'string' ? `"${key}"` : String(key);

			return `${keyText} => ${formatValue(value)}`;
		});

		return generatePreviewText(previews, entries.length > opts.maxPreviewItems);
	},
	previewElement: (node, opts) => {
		const preview = MapType.previewText?.(node, opts) ?? '';
		const children = [
			jsx('span', { kind: 'constructor' }, [txt(`Map(${asMap(node.value).size})`)]),
			jsx('span', { kind: 'brace' }, [txt(' {')])
		];

		if (preview) children.push(jsx('span', { kind: 'preview-text' }, [txt(preview)]));
		children.push(jsx('span', { kind: 'brace' }, [txt('}')]));

		return jsx('span', {}, children);
	},
	node: ({ value, keyPath, createNode }) => {
		const entries = Array.from(asMap(value).entries());
		const entryNodes: JsonNode[] = entries.map(([key, entryValue], index) => ({
			keyPath: [...keyPath, ENTRIES_KEY, index],
			value: { [String(key)]: entryValue },
			type: 'object',
			children: [
				createNode([ENTRIES_KEY, String(key), 'key'], key),
				createNode([ENTRIES_KEY, String(key), 'value'], entryValue)
			]
		}));

		return {
			value,
			keyPath,
			type: 'map',
			children: [
				{
					keyPath: [...keyPath, ENTRIES_KEY],
					value: entries,
					type: 'array',
					children: entryNodes,
					isNonEnumerable: true
				},
				createNode(['size'], asMap(value).size)
			]
		};
	}
});

const ArrayType = dataType({
	type: 'array',
	description: (node) => `Array(${asArray(node.value).length})`,
	check: (value) => Array.isArray(value),
	previewText: (node, opts) => {
		const enumerableChildren = (node.children ?? []).filter(
			(child) => !child.isNonEnumerable && keyPathToKey(child.keyPath) !== 'length'
		);
		const values = enumerableChildren.slice(0, opts.maxPreviewItems).map(formatValueMini);

		return generatePreviewText(values, enumerableChildren.length > opts.maxPreviewItems);
	},
	previewElement: (node, opts) => {
		const preview = ArrayType.previewText?.(node, opts) ?? '';
		const count = asArray(node.value).length;
		const children: JsonElement[] = [];

		if (count > 0) children.push(jsx('span', { kind: 'constructor' }, [txt(`(${count}) `)]));
		children.push(jsx('span', { kind: 'brace' }, [txt('[')]));
		if (preview) children.push(jsx('span', { kind: 'preview-text' }, [txt(preview)]));
		children.push(jsx('span', { kind: 'brace' }, [txt(']')]));

		return jsx('span', {}, children);
	},
	node: ({ value, keyPath, createNode, options }) => {
		const array = asArray(value);
		const arrayChildren: JsonNode[] = [];
		const definedIndices = Object.keys(array)
			.filter((key) => !Number.isNaN(Number(key)))
			.map(Number)
			.sort((a, b) => a - b);
		const chunkSize = options.groupArraysAfterLength;

		if (chunkSize && definedIndices.length > chunkSize) {
			for (let start = 0; start < definedIndices.length; start += chunkSize) {
				const chunk = definedIndices.slice(start, start + chunkSize);
				const groupKey = `[${chunk[0]}…${chunk[chunk.length - 1]}]`;

				arrayChildren.push({
					keyPath: [...keyPath, groupKey],
					value: chunk.map((index) => array[index]),
					type: 'array',
					children: chunk.map((index) => createNode([index.toString()], array[index]))
				});
			}
		} else {
			for (const index of definedIndices) {
				arrayChildren.push(createNode([index.toString()], array[index]));
			}
		}

		return {
			value,
			type: 'array',
			keyPath,
			children: [...arrayChildren, createNode(['length'], array.length)]
		};
	}
});

const ClassType = dataType({
	type: 'object',
	description: (node) => node.constructorName || 'Object',
	check: (value) =>
		typeof value === 'object' && value !== null && value.constructor !== Object,
	previewText: (node, opts) => ObjectType.previewText?.(node, opts) ?? '',
	previewElement: (node, opts) => ObjectType.previewElement(node, opts),
	node: ({ value, keyPath, createNode, options }) => {
		const record = value as Record<string, unknown>;
		const enumerableKeys = Object.keys(record);
		const nonEnumerableKeys = Object.getOwnPropertyNames(record).filter(
			(key) => !enumerableKeys.includes(key)
		);
		const children = enumerableKeys.map((key) => createNode([key], record[key]));

		if (options.showNonenumerable) {
			for (const key of nonEnumerableKeys) {
				const node = createNode([`[[${key}]]`], record[key]);
				node.isNonEnumerable = true;
				node.propertyDescriptor = Object.getOwnPropertyDescriptor(record, key);
				children.push(node);
			}
		}

		return {
			value,
			keyPath,
			type: 'object',
			constructorName: (value as object).constructor?.name,
			children
		};
	}
});

const ObjectType = dataType({
	type: 'object',
	description: 'Object',
	check: (value) => typeof value === 'object' && value !== null,
	previewText: (node, opts) => {
		const children = node.children ?? [];
		const previews = children
			.slice(0, opts.maxPreviewItems)
			.map((child) => `${keyPathToKey(child.keyPath)}: ${getNodeTypeDescription(child, opts)}`);

		return generatePreviewText(previews, children.length > opts.maxPreviewItems);
	},
	previewElement: (node, opts) => {
		const preview = ObjectType.previewText?.(node, opts) ?? '';
		const children: JsonElement[] = [];

		if (node.constructorName)
			children.push(jsx('span', { kind: 'constructor' }, [txt(`${node.constructorName} `)]));
		children.push(jsx('span', { kind: 'brace' }, [txt('{')]));
		if (preview) children.push(jsx('span', { kind: 'preview-text' }, [txt(preview)]));
		children.push(jsx('span', { kind: 'brace' }, [txt('}')]));

		return jsx('span', {}, children);
	},
	node: ({ value, keyPath, createNode, options }) => {
		const record = value as Record<string, unknown>;
		const enumerableKeys = Object.keys(record);
		const nonEnumerableKeys = Object.getOwnPropertyNames(record).filter(
			(key) => !enumerableKeys.includes(key)
		);
		const children = enumerableKeys.map((key) => createNode([key], record[key]));

		if (options.showNonenumerable) {
			for (const key of nonEnumerableKeys) {
				const node = createNode([`[[${key}]]`], record[key]);
				node.isNonEnumerable = true;
				node.propertyDescriptor = Object.getOwnPropertyDescriptor(record, key);
				children.push(node);
			}
		}

		return { value, type: 'object', children, keyPath };
	}
});

const STRING_ESCAPES: Record<string, string> = { '\n': '\\n', '\t': '\\t', '\r': '\\r' };
const STRING_ESCAPE_REGEXP = /[\n\t\r]/g;

const StringType = dataType({
	type: 'string',
	description: (node, opts) =>
		`"${StringType.previewText?.(node, opts) ?? asString(node.value)}"`,
	check: (value) => typeof value === 'string',
	previewText: (node, opts) => {
		const serialised = asString(node.value).replace(
			STRING_ESCAPE_REGEXP,
			(match) => STRING_ESCAPES[match]
		);

		return (
			serialised.slice(0, opts.collapseStringsAfterLength) +
			(serialised.length > opts.collapseStringsAfterLength ? '…' : '')
		);
	},
	previewElement: (node) => {
		const serialised = asString(node.value).replace(
			STRING_ESCAPE_REGEXP,
			(match) => STRING_ESCAPES[match]
		);

		return jsx('span', {}, [txt(`"${serialised}"`)]);
	},
	node: ({ value, keyPath }) => ({ value, type: 'string', keyPath })
});

const PrimitiveType = dataType({
	type: (value) => (typeof value === 'number' ? 'number' : 'boolean'),
	description: (node) => String(node.value),
	check: (value) => value !== null && value !== undefined,
	previewElement: (node) => jsx('span', {}, [txt(String(node.value))]),
	node: ({ value, keyPath }) => ({
		value,
		keyPath,
		type: typeof value === 'number' ? 'number' : 'boolean'
	})
});

const dataTypes: JsonDataType[] = [
	NullType,
	UndefinedType,
	SymbolType,
	BigIntType,
	FunctionType,
	ErrorType,
	DateType,
	RegexType,
	SetType,
	MapType,
	ArrayType,
	ClassType,
	ObjectType,
	StringType,
	PrimitiveType
];

function errorStackToElement(stack: string): JsonElement {
	const lines = stack.split('\n').filter((line) => line.trim());

	return jsx(
		'span',
		{},
		lines.map((line, index) => {
			const appendNewLine = index < lines.length - 1;

			return jsx('span', { nodeType: 'string', kind: 'error-stack' }, [
				jsx('span', {}, [txt(line + (appendNewLine ? '\\n' : ''))]),
				jsx('span', { kind: 'operator' }, [txt(appendNewLine ? ' +' : '')])
			]);
		})
	);
}

/** The preview markup for one row. */
export function jsonNodeToElement(
	node: JsonNode,
	opts?: Partial<JsonNodePreviewOptions>
): JsonElement {
	const options = getPreviewOptions(opts);
	const key = keyPathToKey(node.keyPath, { excludeRoot: true });

	if (key === 'stack' && typeof node.value === 'string') return errorStackToElement(node.value);

	const dataType = dataTypes.find((entry) => entry.check(node.value));

	if (!dataType) return jsx('span', {}, [txt(String(node.value))]);

	const element = dataType.previewElement(node, options);

	if (!key) element.properties.root = true;
	element.properties.kind = 'preview';
	element.properties.nodeType =
		typeof dataType.type === 'function' ? dataType.type(node.value) : dataType.type;

	return element;
}

/** The type name a screen reader announces for a row. */
export function getNodeTypeDescription(
	node: JsonNode,
	opts?: Partial<JsonNodePreviewOptions>
): string {
	const options = getPreviewOptions(opts);
	const dataType = dataTypes.find((entry) => entry.check(node.value));

	if (!dataType) return String(node.value);

	return typeof dataType.description === 'function'
		? dataType.description(node, options)
		: dataType.description;
}

const propertyWord = (count: number): string => (count === 1 ? 'property' : 'properties');

function isPrimitive(node: JsonNode): boolean {
	return node.type === 'string' || node.type === 'number' || node.type === 'boolean';
}

function getDescriptorInfo(descriptor: PropertyDescriptor): string {
	const parts: string[] = [];

	if (!descriptor.writable) parts.push('read-only');
	if (!descriptor.configurable) parts.push('non-configurable');

	return parts.length > 0 ? parts.join(', ') : 'non-enumerable';
}

/** The sentence a screen reader reads for a row. */
export function getAccessibleDescription(
	node: JsonNode,
	opts?: Partial<JsonNodePreviewOptions>
): string {
	const typeDescription = getNodeTypeDescription(node, opts);
	const key = keyPathToKey(node.keyPath, { excludeRoot: true });
	const nonEnumerablePrefix = node.isNonEnumerable ? 'non-enumerable ' : '';
	const format = (text: string): string =>
		[key, `${nonEnumerablePrefix}${text}`].filter(Boolean).join(': ');

	if (node.children && node.children.length > 0) {
		const childCount = node.children.length;

		if (key === ENTRIES_KEY) return format(`${childCount} ${propertyWord(childCount)}`);

		return format(`${typeDescription}, expandable with ${childCount} ${propertyWord(childCount)}`);
	}

	if (isPrimitive(node)) {
		if (key === 'stack')
			return format(
				node.value != null ? String(node.value).split('\n')[1]?.trim() || 'trace' : 'trace'
			);
		if (key === '[[Function]]') return format('function implementation');

		return format(
			`${typeof node.value === 'string' ? `"${node.value}"` : String(node.value)}${
				node.isNonEnumerable && node.propertyDescriptor
					? `, ${getDescriptorInfo(node.propertyDescriptor)}`
					: ''
			}`
		);
	}

	if (node.type === 'null') return format('null');
	if (node.type === 'undefined') return format('undefined');
	if (node.type === 'circular') return format('circular reference');

	return format(
		`${nonEnumerablePrefix}${typeDescription}${
			node.isNonEnumerable && node.propertyDescriptor
				? `, ${getDescriptorInfo(node.propertyDescriptor)}`
				: ''
		}`
	);
}
