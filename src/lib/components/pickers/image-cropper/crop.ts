/** Crop geometry: every rectangle, point and matrix the cropper needs, with no DOM in sight. */

export interface CropPoint {
	x: number;
	y: number;
}

export interface CropSize {
	width: number;
	height: number;
}

export interface CropRect extends CropPoint, CropSize {}

/** The eight drag handles around the crop area. */
export type CropHandle = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/** Which way the image is mirrored. */
export interface CropFlip {
	horizontal: boolean;
	vertical: boolean;
}

/** A 2D affine matrix, in the order `CanvasRenderingContext2D.setTransform` takes. */
export interface CropMatrix {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
}

/** The crop's shape: a circle is always 1:1. */
export type CropShape = 'rect' | 'circle';

interface SizeLimits {
	minWidth: number;
	minHeight: number;
	maxWidth: number;
	maxHeight: number;
	hasAspect: boolean;
}

export const ZERO_POINT: CropPoint = { x: 0, y: 0 };
export const MIN_PINCH_DISTANCE = 1;

const { min, max, abs, round, hypot, PI, cos, sin } = Math;
const ASPECT_RATIO_TOLERANCE = 0.001;

export const clampValue = (value: number, minValue: number, maxValue: number): number =>
	Math.min(Math.max(value, minValue), maxValue);

export const isAspectRatioEqual = (a: number, b: number): boolean =>
	abs(a - b) < ASPECT_RATIO_TOLERANCE;

export const isLeftHandle = (value: CropHandle): boolean =>
	value === 'w' || value === 'nw' || value === 'sw';
export const isRightHandle = (value: CropHandle): boolean =>
	value === 'e' || value === 'ne' || value === 'se';
export const isTopHandle = (value: CropHandle): boolean =>
	value === 'n' || value === 'nw' || value === 'ne';
export const isBottomHandle = (value: CropHandle): boolean =>
	value === 's' || value === 'sw' || value === 'se';

export const isCornerHandle = (value: CropHandle): boolean =>
	(isLeftHandle(value) || isRightHandle(value)) && (isTopHandle(value) || isBottomHandle(value));
export const isHorizontalEdgeHandle = (value: CropHandle): boolean =>
	(isLeftHandle(value) || isRightHandle(value)) && !(isTopHandle(value) || isBottomHandle(value));
export const isVerticalEdgeHandle = (value: CropHandle): boolean =>
	(isTopHandle(value) || isBottomHandle(value)) && !(isLeftHandle(value) || isRightHandle(value));

export const hasAspectRatio = (value: unknown): value is number =>
	typeof value === 'number' && value > 0;

export const isVisibleRect = (rect: CropRect): boolean => rect.width > 0 && rect.height > 0;
export const isSameSize = (a: CropSize, b: CropSize): boolean =>
	a.width === b.width && a.height === b.height;
export const isEqualRect = (a: CropRect, b: CropRect): boolean =>
	a.x === b.x && a.y === b.y && isSameSize(a, b);
export const isValidRect = (rect: CropRect): boolean =>
	[rect.x, rect.y, rect.width, rect.height].every(Number.isFinite);

export const roundRect = (rect: CropRect): CropRect => ({
	x: round(rect.x),
	y: round(rect.y),
	width: round(rect.width),
	height: round(rect.height)
});

export const normalizeFlipState = (nextFlip: Partial<CropFlip> | undefined, currentFlip: CropFlip): CropFlip => {
	if (!nextFlip) return currentFlip;

	return {
		horizontal:
			typeof nextFlip.horizontal === 'boolean' ? nextFlip.horizontal : currentFlip.horizontal,
		vertical: typeof nextFlip.vertical === 'boolean' ? nextFlip.vertical : currentFlip.vertical
	};
};

export const isEqualFlip = (a: CropFlip, b: CropFlip): boolean =>
	a.horizontal === b.horizontal && a.vertical === b.vertical;

export const resolveCropAspectRatio = (shape: CropShape, aspectRatio?: number): number | undefined =>
	shape === 'circle' ? 1 : aspectRatio;

export const getCenterPoint = (rect: CropRect): CropPoint => ({
	x: rect.x + rect.width / 2,
	y: rect.y + rect.height / 2
});

export const getViewportCenter = (size: CropSize): CropPoint => ({
	x: size.width / 2,
	y: size.height / 2
});

export const getMidpoint = (p1: CropPoint, p2: CropPoint, offset: CropPoint = ZERO_POINT): CropPoint => ({
	x: (p1.x + p2.x) / 2 - offset.x,
	y: (p1.y + p2.y) / 2 - offset.y
});

export const getMaxBounds = (cropSize: CropSize, viewportSize: CropSize): CropPoint => ({
	x: max(0, viewportSize.width - cropSize.width),
	y: max(0, viewportSize.height - cropSize.height)
});

export const centerRect = (size: CropSize, viewport: CropSize): CropPoint => ({
	x: max(0, (viewport.width - size.width) / 2),
	y: max(0, (viewport.height - size.height) / 2)
});

export const clampPoint = (point: CropPoint, minPoint: CropPoint, maxPoint: CropPoint): CropPoint => ({
	x: clampValue(point.x, minPoint.x, maxPoint.x),
	y: clampValue(point.y, minPoint.y, maxPoint.y)
});

export const subtractPoints = (a: CropPoint, b: CropPoint): CropPoint => ({
	x: a.x - b.x,
	y: a.y - b.y
});

export const addPoints = (a: CropPoint, b: CropPoint): CropPoint => ({ x: a.x + b.x, y: a.y + b.y });

export const scaleRect = (rect: CropRect, scale: CropPoint): CropRect => ({
	x: rect.x * scale.x,
	y: rect.y * scale.y,
	width: rect.width * scale.x,
	height: rect.height * scale.y
});

export const scaleSize = (size: CropSize, scale: number): CropSize => ({
	width: size.width * scale,
	height: size.height * scale
});

export const getTouchDistance = (p1: CropPoint, p2: CropPoint): number =>
	hypot(p1.x - p2.x, p1.y - p2.y);

export const centerCropOnPoint = (
	cropSize: CropSize,
	center: CropPoint,
	viewportSize: CropSize
): CropPoint => {
	const newPosition = { x: center.x - cropSize.width / 2, y: center.y - cropSize.height / 2 };

	return clampPoint(newPosition, ZERO_POINT, getMaxBounds(cropSize, viewportSize));
};

export const getRotationTransform = (rotation: number): { cos: number; sin: number } => {
	const theta = ((rotation % 360) * PI) / 180;

	return { cos: abs(cos(theta)), sin: abs(sin(theta)) };
};

export const computeAABB = (
	size: CropSize,
	zoom: number,
	cosValue: number,
	sinValue: number
): CropSize => {
	const width = size.width * zoom;
	const height = size.height * zoom;

	return {
		width: width * cosValue + height * sinValue,
		height: width * sinValue + height * cosValue
	};
};

export const getKeyboardMoveDelta = (key: string, step: number): CropPoint => {
	switch (key) {
		case 'ArrowLeft':
			return { x: -step, y: 0 };
		case 'ArrowRight':
			return { x: step, y: 0 };
		case 'ArrowUp':
			return { x: 0, y: -step };
		case 'ArrowDown':
			return { x: 0, y: step };
		default:
			return ZERO_POINT;
	}
};

export const getCropSizeLimits = (props: {
	minWidth: number;
	minHeight: number;
	maxWidth: number;
	maxHeight: number;
}): { minSize: CropSize; maxSize: CropSize } => ({
	minSize: { width: props.minWidth, height: props.minHeight },
	maxSize: { width: props.maxWidth, height: props.maxHeight }
});

function resolveSizeLimits(options: {
	minSize: CropSize;
	maxSize: CropSize;
	viewportSize: CropSize;
	aspectRatio?: number;
}): SizeLimits {
	const { minSize, maxSize, viewportSize, aspectRatio } = options;

	let minWidth = min(minSize.width, viewportSize.width);
	let minHeight = min(minSize.height, viewportSize.height);
	let maxWidth = maxSize.width;

	if (!Number.isFinite(maxWidth)) maxWidth = viewportSize.width;
	maxWidth = min(maxWidth, viewportSize.width);

	let maxHeight = maxSize.height;

	if (!Number.isFinite(maxHeight)) maxHeight = viewportSize.height;
	maxHeight = min(maxHeight, viewportSize.height);

	maxWidth = max(minWidth, maxWidth);
	maxHeight = max(minHeight, maxHeight);

	const hasAspect = hasAspectRatio(aspectRatio);

	if (hasAspect) {
		const ratio = aspectRatio;
		const minWidthWithAspect = max(minWidth, minHeight * ratio);
		const minHeightWithAspect = minWidthWithAspect / ratio;

		minWidth = min(minWidthWithAspect, viewportSize.width);
		minHeight = min(minHeightWithAspect, viewportSize.height);

		let constrainedMaxWidth = min(maxWidth, maxHeight * ratio, viewportSize.width);
		let constrainedMaxHeight = constrainedMaxWidth / ratio;

		if (constrainedMaxHeight > maxHeight || constrainedMaxHeight > viewportSize.height) {
			constrainedMaxHeight = min(maxHeight, viewportSize.height);
			constrainedMaxWidth = constrainedMaxHeight * ratio;
		}

		maxWidth = max(minWidth, min(constrainedMaxWidth, viewportSize.width));
		maxHeight = max(minHeight, min(constrainedMaxHeight, viewportSize.height));
	} else {
		maxWidth = max(minWidth, min(maxWidth, viewportSize.width));
		maxHeight = max(minHeight, min(maxHeight, viewportSize.height));
	}

	return { minWidth, minHeight, maxWidth, maxHeight, hasAspect };
}

function clampAspectSize(params: {
	widthValue: number;
	heightValue: number;
	limits: SizeLimits;
	viewportRect: CropSize;
	aspectRatio: number;
}): CropSize {
	const { widthValue, heightValue, limits, viewportRect, aspectRatio } = params;
	const { minWidth, minHeight, maxWidth, maxHeight } = limits;

	const constrainWidthFromHeight = (height: number): CropSize => {
		let width = clampValue(height * aspectRatio, minWidth, maxWidth);

		width = min(width, viewportRect.width);

		return { width, height: width / aspectRatio };
	};

	const clampByWidth = (value: number): CropSize => {
		let width = clampValue(value, minWidth, maxWidth);

		width = min(width, viewportRect.width);

		let height = width / aspectRatio;

		if (height < minHeight) {
			const constrained = constrainWidthFromHeight(minHeight);

			width = constrained.width;
			height = constrained.height;
		}

		if (height > maxHeight) {
			const clampedHeight = min(maxHeight, viewportRect.height);
			const constrained = constrainWidthFromHeight(clampedHeight);

			width = constrained.width;
			height = constrained.height;
		}

		if (height > viewportRect.height) {
			const constrained = constrainWidthFromHeight(viewportRect.height);

			width = constrained.width;
			height = constrained.height;

			if (height < minHeight) {
				const reconstrained = constrainWidthFromHeight(minHeight);

				width = reconstrained.width;
				height = reconstrained.height;
			}
		}

		return { width, height };
	};

	const clampByHeight = (value: number): CropSize => {
		let height = clampValue(value, minHeight, maxHeight);

		height = min(height, viewportRect.height);

		let width = height * aspectRatio;

		width = clampValue(width, minWidth, maxWidth);
		width = min(width, viewportRect.width);

		let adjustedHeight = width / aspectRatio;

		if (adjustedHeight < minHeight) {
			const constrained = constrainWidthFromHeight(minHeight);

			width = constrained.width;
			adjustedHeight = constrained.height;
		}

		if (adjustedHeight > maxHeight) {
			const clampedHeight = min(maxHeight, viewportRect.height);
			const constrained = constrainWidthFromHeight(clampedHeight);

			width = constrained.width;
			adjustedHeight = constrained.height;
		}

		if (width > viewportRect.width) {
			width = viewportRect.width;
			adjustedHeight = width / aspectRatio;

			if (adjustedHeight > maxHeight) {
				const clampedHeight = min(maxHeight, viewportRect.height);
				const constrained = constrainWidthFromHeight(clampedHeight);

				width = constrained.width;
				adjustedHeight = constrained.height;
			}

			if (adjustedHeight < minHeight) {
				const constrained = constrainWidthFromHeight(minHeight);

				width = constrained.width;
				adjustedHeight = constrained.height;
			}
		}

		return { width, height: adjustedHeight };
	};

	const byWidth = clampByWidth(widthValue);
	const byHeight = clampByHeight(heightValue);
	const deltaWidth = abs(byWidth.width - widthValue) + abs(byWidth.height - heightValue);
	const deltaHeight = abs(byHeight.width - widthValue) + abs(byHeight.height - heightValue);

	return deltaHeight < deltaWidth ? byHeight : byWidth;
}

interface Edges {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

function applyDeltaToEdges(params: {
	bounds: Edges;
	delta: CropPoint;
	handlePosition: CropHandle;
	viewportRect: CropSize;
	minSize: CropSize;
	maxSize: CropSize;
}): Edges {
	const { bounds, delta, handlePosition, viewportRect, minSize, maxSize } = params;
	let { left, top, right, bottom } = bounds;

	if (isLeftHandle(handlePosition)) {
		const minLeft = max(0, right - maxSize.width);
		const maxLeft = right - minSize.width;

		left = clampValue(left + delta.x, minLeft, maxLeft);
	}

	if (isRightHandle(handlePosition)) {
		const minRight = left + minSize.width;
		const maxRight = min(viewportRect.width, left + maxSize.width);

		right = clampValue(right + delta.x, minRight, maxRight);
	}

	if (isTopHandle(handlePosition)) {
		const minTop = max(0, bottom - maxSize.height);
		const maxTop = bottom - minSize.height;

		top = clampValue(top + delta.y, minTop, maxTop);
	}

	if (isBottomHandle(handlePosition)) {
		const minBottom = top + minSize.height;
		const maxBottom = min(viewportRect.height, top + maxSize.height);

		bottom = clampValue(bottom + delta.y, minBottom, maxBottom);
	}

	return { left, top, right, bottom };
}

function applyAspectToHorizontalResize(params: {
	bounds: Edges;
	limits: SizeLimits;
	viewportRect: CropSize;
	aspectRatio: number;
	handlePosition: CropHandle;
}): Edges {
	const { bounds, limits, viewportRect, aspectRatio, handlePosition } = params;
	const { left, top, right, bottom } = bounds;
	const centerY = (top + bottom) / 2;

	let nextWidth = right - left;
	let nextHeight = nextWidth / aspectRatio;

	const constrained = clampAspectSize({
		widthValue: nextWidth,
		heightValue: nextHeight,
		limits,
		viewportRect,
		aspectRatio
	});

	nextWidth = constrained.width;
	nextHeight = constrained.height;

	const halfHeight = nextHeight / 2;

	let newTop = centerY - halfHeight;
	let newBottom = centerY + halfHeight;

	if (newTop < 0) {
		newTop = 0;
		newBottom = nextHeight;
	}

	if (newBottom > viewportRect.height) {
		newBottom = viewportRect.height;
		newTop = newBottom - nextHeight;
	}

	return {
		left: isRightHandle(handlePosition) ? left : right - nextWidth,
		top: newTop,
		right: isRightHandle(handlePosition) ? left + nextWidth : right,
		bottom: newBottom
	};
}

function applyAspectToVerticalResize(params: {
	bounds: Edges;
	limits: SizeLimits;
	viewportRect: CropSize;
	aspectRatio: number;
	handlePosition: CropHandle;
}): Edges {
	const { bounds, limits, viewportRect, aspectRatio, handlePosition } = params;
	const { left, top, right, bottom } = bounds;
	const centerX = (left + right) / 2;

	let nextHeight = bottom - top;
	let nextWidth = nextHeight * aspectRatio;

	const constrained = clampAspectSize({
		widthValue: nextWidth,
		heightValue: nextHeight,
		limits,
		viewportRect,
		aspectRatio
	});

	nextWidth = constrained.width;
	nextHeight = constrained.height;

	const halfWidth = nextWidth / 2;

	let newLeft = centerX - halfWidth;
	let newRight = centerX + halfWidth;

	if (newLeft < 0) {
		newLeft = 0;
		newRight = nextWidth;
	}

	if (newRight > viewportRect.width) {
		newRight = viewportRect.width;
		newLeft = newRight - nextWidth;
	}

	return {
		left: newLeft,
		top: isBottomHandle(handlePosition) ? top : bottom - nextHeight,
		right: newRight,
		bottom: isBottomHandle(handlePosition) ? top + nextHeight : bottom
	};
}

function applyCornerResize(params: {
	bounds: Edges;
	width: number;
	height: number;
	handlePosition: CropHandle;
}): Edges {
	const { bounds, width, height, handlePosition } = params;
	const { left, top, right, bottom } = bounds;

	if (isRightHandle(handlePosition) && isBottomHandle(handlePosition)) {
		return { left, top, right: left + width, bottom: top + height };
	}

	if (isRightHandle(handlePosition) && isTopHandle(handlePosition)) {
		return { left, top: bottom - height, right: left + width, bottom };
	}

	if (isBottomHandle(handlePosition)) {
		return { left: right - width, top, right, bottom: top + height };
	}

	return { left: right - width, top: bottom - height, right, bottom };
}

export interface ResizeCropOptions {
	cropStart: CropRect;
	handlePosition: CropHandle;
	delta: CropPoint;
	viewportRect: CropSize;
	minSize: CropSize;
	maxSize: CropSize;
	aspectRatio?: number;
}

/** The crop rect after a drag of one handle, kept inside the viewport and the size limits. */
export function computeResizeCrop(options: ResizeCropOptions): CropRect {
	const { cropStart, handlePosition, delta, viewportRect, minSize, maxSize, aspectRatio } = options;
	const { x, y, width, height } = cropStart;

	let left = x;
	let top = y;
	let right = x + width;
	let bottom = y + height;

	const { minWidth, minHeight, maxWidth, maxHeight, hasAspect } = resolveSizeLimits({
		minSize,
		maxSize,
		viewportSize: viewportRect,
		aspectRatio
	});

	const edgesAfterDelta = applyDeltaToEdges({
		bounds: { left, top, right, bottom },
		delta,
		handlePosition,
		viewportRect,
		minSize,
		maxSize
	});

	left = edgesAfterDelta.left;
	top = edgesAfterDelta.top;
	right = edgesAfterDelta.right;
	bottom = edgesAfterDelta.bottom;

	if (hasAspect) {
		const ratio = aspectRatio as number;
		const limits: SizeLimits = { minWidth, minHeight, maxWidth, maxHeight, hasAspect };

		if (isCornerHandle(handlePosition)) {
			let tempWidth = right - left;
			let tempHeight = tempWidth / ratio;

			if (
				tempHeight > bottom - top ||
				top + tempHeight > viewportRect.height ||
				left + tempWidth > viewportRect.width
			) {
				tempHeight = bottom - top;
				tempWidth = tempHeight * ratio;
			}

			const constrained = clampAspectSize({
				widthValue: tempWidth,
				heightValue: tempHeight,
				limits,
				viewportRect,
				aspectRatio: ratio
			});
			const result = applyCornerResize({
				bounds: { left, top, right, bottom },
				width: constrained.width,
				height: constrained.height,
				handlePosition
			});

			left = result.left;
			top = result.top;
			right = result.right;
			bottom = result.bottom;
		} else if (isHorizontalEdgeHandle(handlePosition)) {
			const result = applyAspectToHorizontalResize({
				bounds: { left, top, right, bottom },
				limits,
				viewportRect,
				aspectRatio: ratio,
				handlePosition
			});

			left = result.left;
			top = result.top;
			right = result.right;
			bottom = result.bottom;
		} else if (isVerticalEdgeHandle(handlePosition)) {
			const result = applyAspectToVerticalResize({
				bounds: { left, top, right, bottom },
				limits,
				viewportRect,
				aspectRatio: ratio,
				handlePosition
			});

			left = result.left;
			top = result.top;
			right = result.right;
			bottom = result.bottom;
		}
	}

	const maxLeft = max(0, viewportRect.width - minWidth);
	const maxTop = max(0, viewportRect.height - minHeight);

	left = clampValue(left, 0, maxLeft);
	top = clampValue(top, 0, maxTop);

	const maxRight = min(viewportRect.width, left + maxWidth);
	const maxBottom = min(viewportRect.height, top + maxHeight);

	right = clampValue(right, left + minWidth, maxRight);
	bottom = clampValue(bottom, top + minHeight, maxBottom);

	return { x: left, y: top, width: right - left, height: bottom - top };
}

/** A crop rect brought inside the viewport and the size limits. */
export function constrainCrop(options: {
	crop: CropRect;
	viewportRect: CropSize;
	minSize: CropSize;
	maxSize: CropSize;
	aspectRatio?: number;
}): CropRect {
	const { crop, viewportRect, minSize, maxSize, aspectRatio } = options;
	const { width, height } = computeResizeCrop({
		cropStart: { x: 0, y: 0, width: crop.width, height: crop.height },
		handlePosition: 'se',
		delta: ZERO_POINT,
		viewportRect,
		minSize,
		maxSize,
		aspectRatio
	});
	const maxPoint = getMaxBounds({ width, height }, viewportRect);
	const { x, y } = clampPoint(crop, ZERO_POINT, maxPoint);

	return { x, y, width, height };
}

export function computeMoveCrop(
	cropStart: CropRect,
	delta: CropPoint,
	viewportRect: CropSize
): CropRect {
	return {
		x: clampValue(cropStart.x + delta.x, 0, viewportRect.width - cropStart.width),
		y: clampValue(cropStart.y + delta.y, 0, viewportRect.height - cropStart.height),
		width: cropStart.width,
		height: cropStart.height
	};
}

/** Keep the image's offset such that the crop area never shows past its edges. */
export function clampOffset(params: {
	zoom: number;
	rotation: number;
	viewportSize: CropSize;
	offset: CropPoint;
	fixedCropArea?: boolean;
	crop?: CropRect;
}): CropPoint {
	const { zoom, rotation, viewportSize, offset, fixedCropArea, crop } = params;
	const { cos: cosValue, sin: sinValue } = getRotationTransform(rotation);

	if (fixedCropArea && crop) {
		const aabb = computeAABB(viewportSize, zoom, cosValue, sinValue);
		const center = getViewportCenter(viewportSize);
		const cropRight = crop.x + crop.width;
		const cropBottom = crop.y + crop.height;
		const minPoint = {
			x: cropRight - center.x - aabb.width / 2,
			y: cropBottom - center.y - aabb.height / 2
		};
		const maxPoint = {
			x: crop.x - center.x + aabb.width / 2,
			y: crop.y - center.y + aabb.height / 2
		};

		return clampPoint(offset, minPoint, maxPoint);
	}

	const aabb = computeAABB(viewportSize, zoom, cosValue, sinValue);
	const extraWidth = max(0, aabb.width - viewportSize.width);
	const extraHeight = max(0, aabb.height - viewportSize.height);
	const minPoint = { x: -extraWidth / 2, y: -extraHeight / 2 };
	const maxPoint = { x: extraWidth / 2, y: extraHeight / 2 };

	return clampPoint(offset, minPoint, maxPoint);
}

const DEFAULT_VIEWPORT_FILL = 0.8;

/** The crop a fresh cropper starts with. */
export function computeDefaultCropDimensions(
	viewportRect: CropSize,
	aspectRatio?: number,
	fixedCropArea?: boolean
): CropSize {
	const targetWidth = viewportRect.width * DEFAULT_VIEWPORT_FILL;
	const targetHeight = viewportRect.height * DEFAULT_VIEWPORT_FILL;

	if (typeof aspectRatio === 'number' && aspectRatio > 0) {
		if (fixedCropArea) {
			let height = viewportRect.height;
			let width = height * aspectRatio;

			if (width > viewportRect.width) {
				width = viewportRect.width;
				height = width / aspectRatio;
			}

			return { width, height };
		}

		if (aspectRatio > targetWidth / targetHeight) {
			const width = targetWidth;

			return { width, height: width / aspectRatio };
		}

		const height = targetHeight;

		return { width: height * aspectRatio, height };
	}

	if (fixedCropArea) {
		const size = min(viewportRect.width, viewportRect.height);

		return { width: size, height: size };
	}

	return { width: targetWidth, height: targetHeight };
}

/** The arrow-key step, honouring the ctrl/meta and shift modifiers. */
export const getNudgeStep = (
	values: { nudgeStep: number; nudgeStepCtrl: number; nudgeStepShift: number },
	modifiers: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }
): number => {
	if (modifiers.ctrlKey || modifiers.metaKey) return values.nudgeStepCtrl;
	if (modifiers.shiftKey) return values.nudgeStepShift;

	return values.nudgeStep;
};

export interface ImageTransformParams {
	zoom: number;
	offset: CropPoint;
	rotation: number;
	flip: CropFlip;
}

/** The image's transform as a matrix — the same numbers the CSS `matrix()` gets. */
export function getImageTransform(params: ImageTransformParams): CropMatrix {
	const { zoom, offset, rotation, flip } = params;
	const theta = ((rotation % 360) * PI) / 180;
	const safeZoom = zoom > 0 ? zoom : 1;
	const scaleX = safeZoom * (flip.horizontal ? -1 : 1);
	const scaleY = safeZoom * (flip.vertical ? -1 : 1);

	return {
		a: cos(theta) * scaleX,
		b: sin(theta) * scaleX,
		c: -sin(theta) * scaleY,
		d: cos(theta) * scaleY,
		e: offset.x,
		f: offset.y
	};
}

export function getImageTransformCss(params: ImageTransformParams): string {
	const { a, b, c, d, e, f } = getImageTransform(params);

	return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
}

export interface CropMappingParams extends ImageTransformParams {
	imageRect: CropRect;
	naturalSize: CropSize;
}

/** Natural pixels → viewport pixels, through the image's transform and placement. */
export function getNaturalToViewportMatrix(params: CropMappingParams): CropMatrix {
	const { imageRect, naturalSize } = params;
	const transform = getImageTransform(params);
	const imageWidth = imageRect.width > 0 ? imageRect.width : naturalSize.width || 1;
	const imageHeight = imageRect.height > 0 ? imageRect.height : naturalSize.height || 1;
	const naturalWidth = naturalSize.width || imageWidth;
	const naturalHeight = naturalSize.height || imageHeight;
	const scaleX = imageWidth / naturalWidth;
	const scaleY = imageHeight / naturalHeight;
	const a = transform.a * scaleX;
	const b = transform.b * scaleX;
	const c = transform.c * scaleY;
	const d = transform.d * scaleY;
	const centerX = imageRect.x + imageWidth / 2;
	const centerY = imageRect.y + imageHeight / 2;
	const naturalCenterX = naturalWidth / 2;
	const naturalCenterY = naturalHeight / 2;

	return {
		a,
		b,
		c,
		d,
		e: centerX + transform.e - a * naturalCenterX - c * naturalCenterY,
		f: centerY + transform.f - b * naturalCenterX - d * naturalCenterY
	};
}

export function transformPoint(matrix: CropMatrix, point: CropPoint): CropPoint {
	return {
		x: matrix.a * point.x + matrix.c * point.y + matrix.e,
		y: matrix.b * point.x + matrix.d * point.y + matrix.f
	};
}

export function invertMatrix(matrix: CropMatrix): CropMatrix {
	const determinant = matrix.a * matrix.d - matrix.b * matrix.c;

	return {
		a: matrix.d / determinant,
		b: -matrix.b / determinant,
		c: -matrix.c / determinant,
		d: matrix.a / determinant,
		e: (matrix.c * matrix.f - matrix.d * matrix.e) / determinant,
		f: (matrix.b * matrix.e - matrix.a * matrix.f) / determinant
	};
}

/** A point in the viewport, expressed in the image's own pixels. */
export function viewportToNaturalPoint(
	params: CropMappingParams & { point: CropPoint }
): CropPoint {
	return transformPoint(invertMatrix(getNaturalToViewportMatrix(params)), params.point);
}

/** The crop's four corners in the image's own pixels. */
export function getCropSourcePoints(params: CropMappingParams & { crop: CropRect }): {
	topLeft: CropPoint;
	topRight: CropPoint;
	bottomRight: CropPoint;
	bottomLeft: CropPoint;
} {
	const { crop } = params;
	const map = (point: CropPoint): CropPoint => viewportToNaturalPoint({ ...params, point });

	return {
		topLeft: map({ x: crop.x, y: crop.y }),
		topRight: map({ x: crop.x + crop.width, y: crop.y }),
		bottomRight: map({ x: crop.x + crop.width, y: crop.y + crop.height }),
		bottomLeft: map({ x: crop.x, y: crop.y + crop.height })
	};
}

/** The bounding rectangle of the crop, in the image's own pixels. */
export function getCropSourceRect(params: CropMappingParams & { crop: CropRect }): CropRect {
	const points = Object.values(getCropSourcePoints(params));
	let minX = points[0].x;
	let maxX = points[0].x;
	let minY = points[0].y;
	let maxY = points[0].y;

	for (const point of points) {
		minX = min(minX, point.x);
		maxX = max(maxX, point.x);
		minY = min(minY, point.y);
		maxY = max(maxY, point.y);
	}

	return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** The pixel size the crop exports at. */
export function getNaturalCropSize(params: {
	crop: CropRect;
	zoom: number;
	imageRect: CropRect;
	naturalSize: CropSize;
}): CropSize {
	const { crop, zoom, imageRect, naturalSize } = params;
	const safeZoom = zoom > 0 ? zoom : 1;
	const imageWidth = imageRect.width > 0 ? imageRect.width : naturalSize.width || 1;
	const imageHeight = imageRect.height > 0 ? imageRect.height : naturalSize.height || 1;
	const scaleX = (naturalSize.width || imageWidth) / imageWidth / safeZoom;
	const scaleY = (naturalSize.height || imageHeight) / imageHeight / safeZoom;

	return {
		width: max(1, round(crop.width * scaleX)),
		height: max(1, round(crop.height * scaleY))
	};
}

/** The export size, capped to `maxSize` when one is given. */
export function getCropOutputSize(
	params: { crop: CropRect; zoom: number; imageRect: CropRect; naturalSize: CropSize },
	maxSize?: CropSize
): CropSize {
	const size = getNaturalCropSize(params);

	if (!maxSize) return size;

	const scale = min(1, max(1, maxSize.width) / size.width, max(1, maxSize.height) / size.height);

	return {
		width: max(1, round(size.width * scale)),
		height: max(1, round(size.height * scale))
	};
}

/** Point a canvas context at the crop, so drawing the image fills the output. */
export function applyCropExportTransform(
	ctx: CanvasRenderingContext2D,
	params: CropMappingParams & { crop: CropRect },
	outputSize: CropSize
): void {
	const { crop } = params;
	const matrix = getNaturalToViewportMatrix(params);
	const scaleX = outputSize.width / crop.width;
	const scaleY = outputSize.height / crop.height;

	ctx.setTransform(
		matrix.a * scaleX,
		matrix.b * scaleY,
		matrix.c * scaleX,
		matrix.d * scaleY,
		(matrix.e - crop.x) * scaleX,
		(matrix.f - crop.y) * scaleY
	);
}

/** The inline style Zag writes for each resize handle, in declaration form. */
export function getHandlePositionStyle(handlePosition: CropHandle): string {
	switch (handlePosition) {
		case 'n':
			return 'position: absolute; cursor: n-resize; width: 96%; top: 0; left: 50%; translate: -50% -50%';
		case 'e':
			return 'position: absolute; cursor: e-resize; height: 96%; right: 0; top: 50%; translate: 50% -50%';
		case 's':
			return 'position: absolute; cursor: s-resize; width: 96%; bottom: 0; left: 50%; translate: -50% 50%';
		case 'w':
			return 'position: absolute; cursor: w-resize; height: 96%; left: 0; top: 50%; translate: -50% -50%';
		case 'se':
			return 'position: absolute; cursor: se-resize; bottom: 0; right: 0; translate: 50% 50%';
		case 'sw':
			return 'position: absolute; cursor: sw-resize; bottom: 0; left: 0; translate: -50% 50%';
		case 'ne':
			return 'position: absolute; cursor: ne-resize; top: 0; right: 0; translate: 50% -50%';
		case 'nw':
			return 'position: absolute; cursor: nw-resize; top: 0; left: 0; translate: -50% -50%';
		default:
			throw new Error(`Invalid handle position: ${handlePosition}`);
	}
}

/** The handles around the crop area, clockwise from the top-left. */
export const handles: CropHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
