export interface CropPoint {
	x: number;
	y: number;
}

export interface CropSize {
	width: number;
	height: number;
}

export interface CropRect extends CropPoint, CropSize {}

export type CropHandle = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface CropFlip {
	horizontal: boolean;
	vertical: boolean;
}

export interface CropMatrix {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
}


interface SizeLimits {
	minWidth: number;
	minHeight: number;
	maxWidth: number;
	maxHeight: number;
	hasAspect: boolean;
}const { min, max, abs, round, hypot, PI, cos, sin } = Math;
const ASPECT_RATIO_TOLERANCE = 0.001;

export const clampValue = (value: number, minValue: number, maxValue: number): number =>
	Math.min(Math.max(value, minValue), maxValue);
export const isLeftHandle = (value: CropHandle): boolean =>
	value === 'w' || value === 'nw' || value === 'sw';
export const isRightHandle = (value: CropHandle): boolean =>
	value === 'e' || value === 'ne' || value === 'se';
export const isTopHandle = (value: CropHandle): boolean =>
	value === 'n' || value === 'nw' || value === 'ne';
export const isBottomHandle = (value: CropHandle): boolean =>
	value === 's' || value === 'sw' || value === 'se';
export const hasAspectRatio = (value: unknown): value is number =>
	typeof value === 'number' && value > 0;function resolveSizeLimits(options: {
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