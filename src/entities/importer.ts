import { Row } from "./row";

export interface Importer {
    import(file: Buffer): Promise<Row[]>
}