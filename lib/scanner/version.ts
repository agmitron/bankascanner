import type { Statement } from "~/statement";
import type { Scanner } from ".";

export const DEFAULT_VERSION = "latest";

export type Version<V extends string = typeof DEFAULT_VERSION> =
	| typeof DEFAULT_VERSION
	| V;

/**
 * Versioner is responsible for guessing the version of the
 * statement and choosing the appropriate importer.
 * @template V - the supported versions that the versioner can handle.
 */
export interface Versioner<V extends Version<string>> {
	/**
	 * Tries to determine the version of the statement according to its contents.
	 */
	guess(s: Statement): V;

	/**
	 * Chooses the importer based on the version of the statement.
	 */
	choose(v: V): Scanner;

	/**
	 * Returns the list of supported versions.
	 */
	get supported(): V[];
}

export class UnknownVersionError extends Error {
	constructor(version: string, bank: string) {
		super(`Unknown version ${version} for bank ${bank}`);
	}
}
