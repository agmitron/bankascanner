// This is a simple script that reads a PDF file and writes its content to a text file.
// Usage: `npx pdf2text.ts --in=path/to/in.pdf --out=path/to/out.txt`

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFImporter } from "./src/importer/pdf";

const argv = yargs(hideBin(process.argv))
	.options({
		in: { type: "string", demandOption: true },
		out: { type: "string", demandOption: true },
	})
	.parseSync();

async function run() {
	const pdfData = await readFile(path.resolve(__dirname, argv.in));

	async function* toAsyncIterable(
		buffer: Uint8Array,
	): AsyncIterable<Uint8Array> {
		yield buffer;
	}

	const importer = new PDFImporter();
	const { content } = await importer.import(toAsyncIterable(pdfData));

	const out = path.resolve(__dirname, argv.out);
	return writeFile(out, content);
}

run().catch(console.error);
