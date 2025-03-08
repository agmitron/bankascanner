import fs from "node:fs";
import yargs from "yargs";
import path from "node:path";
import { hideBin } from "yargs/helpers";
import * as scanner from "~/scanner";
import * as exporter from "~/exporter";
import * as importer from "~/importer";

import { DEFAULT_VERSION } from "~/scanner/version";
import { UnsupportedFormatError } from "~/exporter/error";
import { Readable } from "node:stream";
import { StreamLoader } from "~/importer/loader";
import { DiskSaver } from "~/exporter/saver";

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

	const inputFileSize = fs.statSync(inputPath).size;
	const importLoader = new StreamLoader(Readable.toWeb(fs.createReadStream(inputPath)));
	// importLoader.subscribe((_i, _s, bytesRead) => {
	// 	console.log(`[IMPORT] ${Math.round((bytesRead / inputFileSize) * 100)}%`);
	// })

	const statement = await imp.import(importLoader);

	const scan = scanner.run(argv.bank, argv.version, statement);

	const output = exporter.run(scan, argv.out);
	const exportLoader = new StreamLoader(output);
	// exportLoader.subscribe((index) => {
	// 	console.log(`Exporting operation ${index}...`);
	// })

	await new DiskSaver(outputPath).save(exportLoader);
}

main().catch(console.error);
