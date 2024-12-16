import type { Row } from "./row";

export class UnsupportedFormatError extends Error {
    constructor(format: string, allowedFormats: string[]) {
        super(`Unsupported format ${format}. Allowed formats: ${allowedFormats.join(", ")}`);
    }
}

export interface Exporter {
    export(data: Row[]): Promise<Buffer>;
}