import { JSONExporter } from "./json";
import { UnsupportedFormatError } from "./error";
import type { Scan } from "~/scanner";
import { CSVExporter } from "./csv";

export interface Exporter {
	readonly canFail: boolean;

	export(s: Scan): ReadableStream<Uint8Array>;
}

const exporters: Record<string, Exporter> = {
	json: new JSONExporter(false),
	csv: new CSVExporter(),
};

export const run = (
	scan: Scan,
	out: string,
	format = out.split(".").pop(),
): ReadableStream<Uint8Array> => {
	if (!format) {
		throw new Error(`Invalid out format ${out}`);
	}

	const exporter = exporters[format];
	if (!exporter) {
		throw new UnsupportedFormatError(format, Object.keys(exporters));
	}

	return exporters[format].export(scan);
};
