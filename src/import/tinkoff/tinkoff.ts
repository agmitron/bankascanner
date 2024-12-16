import { Result } from "pdf-parse";
import { Importer } from "~/entities/importer";
import { Row } from "~/entities/row";
import { ddmmyyyy } from "~/utils/date";
import pdf2data from "pdf-parse";

//date for correct data match

const FAKE_DATA = `10.10.1010
08:32`

export class Tinkoff implements Importer {

    public async import(file: Buffer): Promise<Row[]> {
        const data = await pdf2data(file);
        const pieces = this._split(data.text);
        return pieces.map((r) => this._extractInfo(r))
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

    private _extractInfo(input: string): Row {
        const regex = /((\d{2}\.\d{2}\.\d{4})\s*(\d{2}:\d{2})\s*){2}((\+|\-)(\d+\s?\d+.\d{2})\s(.)){2}((.*\n?)*)/
        const match = input.match(regex);

        if (!match) {
            throw new Error("Input does not match the expected format");
        }

        // Извлечение данных
        const dateStr = match[2].trim();
        const time = match[3].trim();
        const valueStr = match[6].trim(); //
        const comment = match[8].trim().replaceAll('\n', ' '); // Извлекаем комментарий
        const currency = match[7]; // Предполагаем, что валюта фиксирована
        const operator = match[5].trim();

        const card = comment.match(/(?=(.*\s?)(\d{4}|—))/)
        if (!card) {
            throw new Error("Card number not found");
        }

        const commentWithoutCard = comment.replace(card[2], '').trim()

        // Преобразование строки значений в число
        let value = parseFloat(valueStr.replace(/[\s₽]/g, ''));
        if (operator === "-") {
            value = value * (-1)
        }

        // Формируем объект Row
        const row: Row = {
            date: ddmmyyyy(dateStr, time),
            value,
            category: "other", // Здесь можно добавить логику для определения категории
            comment: commentWithoutCard,
            currency: currencyMapping[currency] ?? otherCurrency,
        };

        return row;

    }
}
const currencyMapping: Record<string, string> = {
    "₽": "RUB",
    "$": "USD",
    "€": "EUR",
}