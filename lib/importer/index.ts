export type Chunk = string;

export interface File {
	content: string;
}

export interface Importer {
	import(file: Uint8Array): Promise<File>;
}
