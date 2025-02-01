import type { Category } from "./category";
import type { Importer } from "./import";

export const DEFAULT_VERSION = "latest";

export type Version<V extends string> = typeof DEFAULT_VERSION | V;

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


// TODO: naming
interface BuildParams<V extends string> {
	supported: Record<Version<V>, Importer>;
	guess?: Versioner<V>["guess"];
	choose?: Versioner<V>["choose"];
}

export function version<V extends string>(
	{
		supported,
		choose = (v) => supported[v] ?? supported[DEFAULT_VERSION],
		guess = async () => DEFAULT_VERSION,
	}: BuildParams<V>
): new () => Versioner<V> {
	const Implementation = class implements Versioner<V> {
		public get supported() {
			return Object.keys(supported) as Version<V>[];
		}

		public async guess(file: Buffer): Promise<Version<V>> {
			return guess(file);
		}

		public choose(v: Version<V>) {
			return choose(v);
		}
	}

	Object.defineProperty(Implementation, "name", { value: "Versioner" });

	return Implementation;
}