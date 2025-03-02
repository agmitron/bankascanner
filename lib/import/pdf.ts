import { createReadStream } from "fs";
import type { Importer } from ".";

export class PDFImporter implements Importer {
	import(file: ReadableStream<Buffer>): ReadableStream<string> {
		return new ReadableStream({
			start(controller) {},
		});
	}
}

const importer = new PDFImporter();

importer.import(createReadStream("file.pdf"));
