// This is a simple script that reads a PDF file and writes its content to a text file.
// Usage: `npx pdf2text.ts --in=path/to/in.pdf --out=path/to/out.txt`

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pdf2text from "pdf-parse";

const argv = yargs(hideBin(process.argv))
	.options({
		in: { type: "string", demandOption: true },
		out: { type: "string", demandOption: true },
	})
	.parseSync();

async function run() {
	const pdf = await readFile(path.resolve(__dirname, argv.in));
	const { text } = await pdf2text(pdf);

	const out = path.resolve(__dirname, argv.out);
	return writeFile(out, text);
}

run().catch(console.error);
