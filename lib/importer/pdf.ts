import pdf2text from "pdf-parse";
import { Buffer } from "buffer";
import type { Importer } from "~/importer";
import type { Statement } from "~/statement";
import type { Reader } from "./reader";

export class PDFImporter implements Importer {
	async import(file: Reader): Promise<Statement> {
		// Since PDF is a binary format, we need to read the whole file into memory.
		const chunks: Uint8Array[] = [];

		for await (const chunk of file) {
			chunks.push(chunk);
		}

		const result = await pdf2text(Buffer.concat(chunks));
		return {
			content: result.text,
		};
	}
}
