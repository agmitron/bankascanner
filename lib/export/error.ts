export class UnsupportedFormatError extends Error {
    constructor(format: string, allowedFormats: string[]) {
        super(
            `Unsupported format ${format}. Allowed formats: ${allowedFormats.join(", ")}`,
        );
    }
}