import { left } from "@/lib/either";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as importer from "~/importer";
import * as exporter from "~/exporter";

const argv = yargs(hideBin(process.argv))
	.version(false)
	.options({
		in: { type: "string", demandOption: true },
		out: { type: "string", demandOption: true },
		importer: {
			type: "string",
			description: "Path to the importer implementation.",
			demandOption: true,
		},
		exporter: {
			type: "string",
			description: "Path to the exporter implementation.",
			demandOption: true,
		},
	})
	.parseSync();

async function resolve<T>(path: string): Promise<T> {
	const module = await import(path);
	return module.default;
}

async function main() {
	const importer = await resolve<importer.Definition>(
		path.resolve(argv.importer),
	);

	const exporter = await resolve<exporter.Definition>(
		path.resolve(argv.exporter),
	);

	const input = await readFile(path.resolve(argv.in));

	const scan = await importer.run(input);
	if (scan.isLeft()) {
		return Promise.resolve(left("Failed to parse"));
	}

	const serialized = await exporter.run(scan.value);
	if (serialized.isLeft()) {
		return Promise.resolve(left("Failed to serialize"));
	}

	const output = serialized.value;

	await writeFile(argv.out, output);
}

main().catch(console.error);
