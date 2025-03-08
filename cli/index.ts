import fs from "node:fs";
import yargs from "yargs";
import path from "node:path";
import { hideBin } from "yargs/helpers";
import * as scanner from "~/scanner";
import * as exporter from "~/exporter";
import * as importer from "~/importer";

import { DEFAULT_VERSION } from "~/scanner/version";
import { UnsupportedFormatError } from "~/exporter/error";
import { Reader, Subscriber } from "~/importer/reader";
import { Readable, Writable } from "node:stream";

const argv = yargs(hideBin(process.argv))
	.version(false)
	.options({
		in: { type: "string", demandOption: true },
		out: { type: "string", demandOption: true },
		bank: {
			type: "string",
			demandOption: true,
			choices: scanner.choices(),
		},
		version: { type: "string", alias: "v", default: DEFAULT_VERSION },
	})
	.check((argv) => scanner.get(argv.bank))
	.parseSync();

// TODO: refactor
async function main() {
	const imp = importer.choose("pdf");
	if (!imp) {
		throw new UnsupportedFormatError("pdf", importer.choices());
	}

	const inputPath = path.resolve(__dirname, "..", argv.in);
	const outputPath = path.resolve(__dirname, "..", argv.out);

	const input = fs.createReadStream(inputPath);
	const importReader = new Reader(Readable.toWeb(input));

	const statement = await imp.import(importReader);
	const scan = scanner.run(argv.bank, argv.version, statement);

	const output = exporter.run(scan, argv.out);
	const exportReader = new Reader(output);

	const writeStream = fs.createWriteStream(outputPath);
	for await (const chunk of exportReader) {
		writeStream.write(chunk);
	}
}

main().catch(console.error);
