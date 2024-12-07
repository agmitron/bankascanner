import { Result } from "pdf-parse";
import { Importer } from "~/domain/import";
import { Row } from "~/domain/row";

export class Tinkoff implements Importer {
    import(file: Buffer): Promise<Row[]> {
        throw new Error("Method not implemented.");
    }
}