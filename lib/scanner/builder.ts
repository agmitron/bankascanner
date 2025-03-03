import type { Attempt, Scan, Scanner } from "~/scanner";
import {
	DEFAULT_VERSION,
	UnknownVersionError,
	type Version,
	type Versioner,
} from "./version";
import type { Statement } from "~/statement";

/** Represents a part of the statement that should contain an Operation (like row of a table). */
type Piece = string;

/**
 * Extractor is a short description of how to split the full file to pieces
 * and how to extract an Operation from each piece.
 *
 * It's usually enough to parse a statement, so there are just two methods.
 */
interface Extractor {
	pieces: (raw: string) => Piece[];
	operation: (piece: string) => Attempt;
}

export function build<V extends Version<string>>(
	name: string,
	extractors: Record<Version<V>, Extractor>,
	guessVersion: (s: Statement) => V = () => DEFAULT_VERSION as V,
): Versioner<V> {
	class Implementation implements Versioner<V> {
		guess(s: Statement): V {
			return guessVersion(s);
		}

		choose(v: V): Scanner {
			const extractor = extractors[v];
			if (!extractor) {
				throw new UnknownVersionError(v, name);
			}

			class S implements Scanner {
				scan(s: Statement): Scan {
					const pieces = extractor.pieces(s.content);
					return pieces.map(extractor.operation);
				}
			}

			return new S();
		}

		get supported(): V[] {
			return Object.keys(extractors) as V[];
		}
	}

	return new Implementation();
}
