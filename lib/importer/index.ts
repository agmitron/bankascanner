import type { Statement } from "~/statement";
import type {  Reader } from "./reader";
import { PDFImporter } from "./pdf";

const importers = {
	pdf: PDFImporter,
} as const;

type Format = keyof typeof importers;

/** Importer is an abstraction that reads a file and returns a Statement.
 *
 * Since statements might be stored in different formats, there might be different implementations of this interface.
 */
export interface Importer {
	import(r: Reader): Promise<Statement>;
}

export const choices = () => Object.keys(importers);

export function choose(f: Format): Importer | null {
	const Imp = importers[f];
	if (!Imp) {
		return null;
	}

	return new Imp();
}
