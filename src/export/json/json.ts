import type { Exporter } from "~/domain/export";
import type { Row } from "~/domain/row";

export class JSONExporter implements Exporter {
	export(data: Row[]): Promise<Buffer> {
		return Promise.resolve(Buffer.from(JSON.stringify(data, null, 2)));
	}
}
