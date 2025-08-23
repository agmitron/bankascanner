import { Either, left, right } from "@/lib/either";
import { Exporter } from "./exporter";
import { Importer } from "./importer";

type Failure = "Failed to parse" | "Failed to serialize";

export async function process(
	file: Uint8Array,
	importer: Importer,
	exporter: Exporter,
): Promise<Either<Failure, Uint8Array>> {
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
