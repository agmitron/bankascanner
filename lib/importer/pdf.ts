import { Buffer } from "buffer";
import { getDocument } from "pdfjs-dist";
import {
	type TextItem,
	TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import type { Importer } from "~/importer";
import type { Statement } from "~/statement";

export class PDFImporter implements Importer {
	async import(file: AsyncIterable<Uint8Array>): Promise<Statement> {
		// Since PDF is a binary format, we need to read the whole file into memory.
		const chunks: Uint8Array[] = [];

		for await (const chunk of file) {
			chunks.push(chunk);
		}

		const data = Buffer.concat(chunks);

		const loadingTask = getDocument({ data });
		const pdf = await loadingTask.promise;

		let textContentAggregate = "";
		for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
			const page = await pdf.getPage(pageNumber);
			const textContent = await page.getTextContent();
			const pageText = (textContent.items as TextItem[])
				.map((item) => (typeof item.str === "string" ? item.str : ""))
				.join(" ");
			textContentAggregate += `${pageText}\n`;
		}

		await pdf.cleanup();

		return {
			content: textContentAggregate,
		};
	}
}
