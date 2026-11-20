/** One image in a lightbox. */
export interface LightboxItem {
	src: string;
	/** The smaller image shown in the strip; `src` is used when omitted. */
	thumbnail?: string;
	alt?: string;
	caption?: string;
}

export {};
