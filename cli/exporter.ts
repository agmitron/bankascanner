import { type Exporter, UnsupportedFormatError } from "~/entities/export";
import type { Row } from "~/entities/row";

import { JSONExporter } from "~/export/json";

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
