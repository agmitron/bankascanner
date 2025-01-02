import type { Category } from "./category";

export const DEFAULT_VERSION = "latest";

export type Version<V extends string> = typeof DEFAULT_VERSION | V;

export interface Row {
	date: Date;
	value: number;
	category: Category;
	comment: string;
	currency: string;
}

export interface Importer {
	import(file: Buffer): Promise<Row[]>;
}

/**
 * Versioner is responsible for guessing the version of the
 * statement and choosing the appropriate importer.
 * @template V - the supported versions that the versioner can handle.
 */
export interface Versioner<V extends string> {
	/**
	 * Tries to determine the version of the statement according to its contents.
	 */
	guess(file: Buffer): Promise<Version<V>>;

	/**
	 * Chooses the importer based on the version of the statement.
	 */
	choose(v: Version<V>): Importer;

	/**
	 * Returns the list of supported versions.
	 */
	get supported(): Version<V>[];
}
