import fs from "node:fs";
import yargs from "yargs";
import path from "node:path";
import { hideBin } from "yargs/helpers";
import * as exporter from "../src/exporter";
import * as importer from "../src/importer";

import { Readable } from "node:stream";

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

async function main() {
	const imp = importer.choose("pdf");
	if (!imp) {
		throw new UnsupportedFormatError("pdf", importer.choices());
	}

	const inputPath = path.resolve(__dirname, "..", argv.in);
	const input = Readable.toWeb(fs.createReadStream(inputPath));
	const statement = await imp.import(input);

	const scan = scanner.run(argv.bank, argv.version, statement);

	const outputPath = path.resolve(__dirname, "..", argv.out);
	const output = exporter.run(scan, outputPath);
	await new Disk(outputPath).save(output);
}

main().catch(console.error);
