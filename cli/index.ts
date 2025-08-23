import { left, right } from "@/lib/either";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
	.version(false)
	.options({
		in: { type: "string", demandOption: true },
		out: { type: "string", demandOption: true },
		importer: {
			type: "string",
			description: "Path to the importer implementation.",
		},
		exporter: {
			type: "string",
			description: "Path to the exporter implementation.",
		},
	})
	.parseSync();

async function main() {
	const scan = await importer(file);
	if (scan.isLeft()) {
		return Promise.resolve(left("Failed to parse"));
	}

	const serialized = await exporter(scan.value);
	if (serialized.isLeft()) {
		return Promise.resolve(left("Failed to serialize"));
	}

	return Promise.resolve(right(serialized.value));
}

main().catch(console.error);
