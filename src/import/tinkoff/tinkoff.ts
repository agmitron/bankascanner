import { Result } from "pdf-parse";
import { Importer } from "~/entities/importer";
import { Row } from "~/entities/row";

export class Tinkoff implements Importer {

    import(file: Buffer): Promise<Row[]> {
        throw new Error("Method not implemented.");
    }
    private _split(data: string): string[] {
        // Удаляем пустые строки
        // const withoutEmptyLines = data.replaceAll(/^\s*\n/gm, "");
        const re = /(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}([\n\s]*)\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})(\n?.*?)(?=(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}([\n\s]*)\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})*(\n?.*)(\n?.*))/gm;
        const matches = re.exec(data)

        let m;

        while ((m = re.exec(data)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
            });
        }


        if (!matches) {
            return [];
        }

        const pieces: string[] = [];

        for (const m of matches) {
            // Разбиваем на строки и добавляем форматирование
            const lines = m.split(/\s*\n\s*/).map(line => line.trim()).filter(line => line.length > 0);

            // Добавляем первую строку (дату и время)
            pieces.push(lines[0]); // Первая строка - это дата и время

            // Добавляем остальные строки с символом "-"
            for (let i = 1; i < lines.length; i++) {
                pieces.push(`-   ${lines[i]}`);
            }
        }

        return pieces;

    }
}