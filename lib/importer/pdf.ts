import pdf2text from "pdf-parse";
import { Buffer } from "buffer";
import type { Importer, Progress, Event } from "~/importer";
import { Subscriber } from "~/subscriber";
import type { Statement } from "~/statement";

export class PDFImporter extends Subscriber<Event, Progress> implements Importer {
	async import(file: ReadableStream<Uint8Array>): Promise<Statement> {
		const reader = file.getReader();
		const chunks: Uint8Array[] = [];

		let bytesRead = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}

			chunks.push(value);

			bytesRead += value.length;
			this._emit("progress", { bytes: bytesRead });
		}

		const result = await pdf2text(Buffer.concat(chunks));
		return {
			content: result.text,
		}
	}
}
