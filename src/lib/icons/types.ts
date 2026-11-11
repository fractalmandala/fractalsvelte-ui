/**
 * One icon: a tag name plus its attributes, in draw order.
 * Paint attributes (stroke, stroke-width, fill, linecaps) live on the wrapping `g`,
 * so `Icon`'s `strokeWidth` prop can override them in one place.
 */
export type IconNode = readonly (readonly [string, Readonly<Record<string, string | number>>])[];
