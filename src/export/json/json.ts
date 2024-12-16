import type { Exporter } from "~/entities/export";
import type { Row } from "~/entities/row";

export class JSONExporter implements Exporter {
	export(data: Row[]): Promise<Buffer> {
		return Promise.resolve(Buffer.from(JSON.stringify(data, null, 2)));
	}
}
