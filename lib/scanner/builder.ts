import { right } from "~/either";
import type { Attempt } from ".";
import type { Version, Versioner } from "./version";

/** Represents a part of the statement that should contain an Operation (like row of a table). */
type Piece = string;

/**
 * Extractor is a short description of how to split the full file to pieces
 * and how to extract an Operation from a piece.
 *
 * It's usually enough to parse a statement, so there are just two methods.
 */
interface Extractor {
	pieces: (raw: string) => Piece[];
	operation: (piece: string) => Attempt;
}

export function build<V extends string>(
	extractors: Record<Version<V>, Extractor>,
): Versioner<V> {
	return {};
}

type SomeParserVersion = Version<"2024" | "2025">;

build<SomeParserVersion>({
	latest: {
		pieces(raw) {
			return raw.split("\n");
		},
		operation(piece) {
			return right({
				operation: {
					date: new Date(),
					category: "other",
					currency: "USD",
					comment: "Some description",
					value: 0,
				},
			});
		},
	},
	"2024": {},
	"2025": {},
});
