import fs from "node:fs/promises";
import yargs from "yargs";
import path from "node:path";
import { hideBin } from "yargs/helpers";
import * as importer from "~/import";
import * as exporter from "~/export";

import { DEFAULT_VERSION } from "~/entities/import";

const argv = yargs(hideBin(process.argv))
	.version(false)
	.options({
		in: { type: "string", demandOption: true },
		out: { type: "string", demandOption: true },
		bank: {
			type: "string",
			demandOption: true,
			choices: importer.choices(),
		},
		version: { type: "string", alias: "v", default: DEFAULT_VERSION },
	})
	.check((argv) => importer.supports(argv.bank))
	.parseSync();

async function main() {
	const pdf = await fs.readFile(path.resolve(__dirname, argv.in));

	const rows = await importer.run(argv.bank, argv.version, pdf);
	const buffer = await exporter.run(rows, argv.out); 

	await fs.writeFile(path.resolve(__dirname, argv.out), buffer);
}

main().catch(console.error);
