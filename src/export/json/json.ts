import type { Exporter } from "~/entities/exporter";
import type { Row } from "~/entities/row";

export class JSONExporter implements Exporter {
    export(data: Row[]): Promise<Buffer> {
        return Promise.resolve(Buffer.from(JSON.stringify(data, null, 2)));
    }
}