import { type Exporter, UnsupportedFormatError } from "~/entities/export";
import type { Row } from "~/entities/row";

import { JSONExporter } from "~/export/json";

const exporters: Record<string, Exporter> = {
	json: new JSONExporter(),
};

const allowedFormats = Object.keys(exporters);

// TODO: other export formats
export const run = (
	rows: Row[],
	out: string,
	format = out.split(".").pop(),
): Promise<Buffer> => {
	if (!format) {
		throw new Error(`Invalid out format ${out}`);
	}

	if (!allowedFormats.includes(format)) {
		throw new UnsupportedFormatError(format, allowedFormats);
	}

	return exporters[format].export(rows);
};
