import { Result } from "pdf-parse";
import { Importer } from "~/entities/importer";
import { Row } from "~/entities/row";
import { ddmmyyyy } from "~/utils/date";

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

    private _extractInfo(input: string): Row {
        const regex = /((\d{2}\.\d{2}\.\d{4})\s*(\d{2}:\d{2})\s*){2}((\+|\-)(\d+\s\d+.\d{2})\s(.)){2}((.*\n)*)/
        const match = input.match(regex);
    
        if (!match) {
            throw new Error("Input does not match the expected format");
        }
    
        // Извлечение данных
        const dateStr = match[0]; // Первая дата
        const valueStr = match[4]; //
        const comment = match[6].split('\n').slice(4).join(' ').trim(); // Извлекаем комментарий
        const currency = "RUB"; // Предполагаем, что валюта фиксирована
    
        // Преобразование строки значений в число
        const value = parseFloat(valueStr.replace(/[\s₽]/g, ''));
    
        // Формируем объект Row
        const row: Row = {
            date: new Date(dateStr.split('.').reverse().join('-')), // Преобразуем строку даты в объект Date
            value: value,
            category: "other", // Здесь можно добавить логику для определения категории
            comment: comment,
            currency: currency,
        };
    
        return row;

    }
}