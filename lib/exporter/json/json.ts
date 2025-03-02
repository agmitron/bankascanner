import type { Exporter } from "~/export";
import type { Operation } from "~/operation";

export class JSONExporter implements Exporter {
	export(data: Operation[]): Promise<Buffer> {
		return Promise.resolve(Buffer.from(JSON.stringify(data, null, 2)));
	}
}
