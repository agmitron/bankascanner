import type { Row } from "./row";

export interface Exporter {
    export(data: Row[]): Promise<Buffer>;
}