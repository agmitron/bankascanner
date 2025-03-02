export interface Body {
	content: string;
	meta: Record<string, string>;
}

export interface Importer {
	import(file: ReadableStream<Buffer>): ReadableStream<Body>;
}
