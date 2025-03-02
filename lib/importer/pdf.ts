import pdf2text from 'pdf-parse'
import { Buffer } from 'buffer'
import type { File, Importer } from "~/importer";

export class PDFImporter implements Importer {
	async import(file: Uint8Array): Promise<File> {
		const result = await pdf2text(Buffer.from(file));

		return {
			content: result.text,
			// TODO: meta if needed
		}
	}
}
