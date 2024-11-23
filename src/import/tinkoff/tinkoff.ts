import { Result } from "pdf-parse";
import { Importer } from "~/entities/importer";
import { Row } from "~/entities/row";

export class Tinkoff implements Importer {
    import(file: Buffer): Promise<Row[]> {
        throw new Error("Method not implemented.");
    }
}