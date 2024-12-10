import { Result } from "pdf-parse";
import { Importer } from "~/entities/importer";
import { Row } from "~/entities/row";

//date for correct data match

const FAKE_DATA = `10.10.1010
08:32`

export class Tinkoff implements Importer {

    import(file: Buffer): Promise<Row[]> {
        throw new Error("Method not implemented.");
    }
    private _split(data: string): string[] {
        //add fake date for last element of data array
        data = `${data}
        ${FAKE_DATA}`
        
        const re = /(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}([\n\s]*)\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})([\s\S]*?)(?=\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})/gm;
        const matches = data.matchAll(re)
        const piecesArray = [...matches];
        
        if (!matches) {
            return [];
        }

        const pieces: string[] = piecesArray.map((subarray) => subarray[0].trim());

        return pieces;

    }
}