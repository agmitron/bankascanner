import pdf2data from "pdf-parse";
import { otherCurrency } from "~/currency";
import type { Importer } from "~/import";
import type { Row } from "~/row";
import { ddmmyyyy } from "~/date";

// date for correct data match
const FAKE_DATA = `10.10.1010
08:32`;

export class JusanV2024 implements Importer {public async import(file: Buffer): Promise<Row[]> {
        const data = await pdf2data(file);
        const pieces = this._split(data.text);
        // return pieces.map((r) => this._extractInfo(r));
    }

    private _split(text: string): string[] {
        // add fake date for last element of data array
        const data = `${text}
        ${FAKE_DATA}`;

        const re =
            /(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}([\n\s]*)\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})([\s\S]*?)(?=\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})/gm;
        const matches = data.matchAll(re);

        if (!matches) {
            return [];
        }

        const pieces: string[] = [...matches].map(([m]) => m.trim());

        return pieces;
    }
}