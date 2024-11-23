// This is a simple script that reads a PDF file and writes its content to a text file.
// Usage: `ts-node pdf2text.ts --in=path/to/in.pdf --out=path/to/out.txt`

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { readFile, writeFile } from "fs/promises";
import path from "path";
import pdfParser from "pdf-parse";

const argv = yargs(hideBin(process.argv))
  .options({
    in: { type: "string", demandOption: true },
    out: { type: "string", demandOption: true },
  })
  .parseSync();

async function run() {
  const pdf = await readFile(path.resolve(__dirname, argv.in));
  const data = await pdfParser(pdf);

  await writeFile(path.resolve(__dirname, argv.out), data.text);
}

run().catch(console.error);
