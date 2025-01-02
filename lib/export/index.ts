import type { Row } from "~/row";
import { JSONExporter } from "./json";
import { UnsupportedFormatError } from "./error";

export interface Exporter {
	export(data: Row[]): Promise<Buffer>;
}

const exporters: Record<string, Exporter> = {
	json: new JSONExporter(),

	// TODO: csv
};

export const run = (
	rows: Row[],
	out: string,
	format = out.split(".").pop(),
): Promise<Buffer> => {
	if (!format) {
		throw new Error(`Invalid out format ${out}`);
	}

	const exporter = exporters[format];
	if (!exporter) {
		throw new UnsupportedFormatError(format, Object.keys(exporters));
	}

	return exporters[format].export(rows);
};
