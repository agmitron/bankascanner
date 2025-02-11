import pdf2data from "pdf-parse";
import type { Importer } from "~/import";
import type { Row } from "~/row";
import { ddmmyyyy } from "~/date";

export class TbcV2024 implements Importer {
	public async import(file: Buffer): Promise<Row[]> {
		const data = await pdf2data(file);
		const pieces = this._split(data.text);
		console.log(pieces);

		return pieces
			.filter((r) => this._isValidTransaction(r))
			.map((r) => this._extractInfo(r));
	}

	private _isValidTransaction(input: string): boolean {
		const regex = /(\d{2}\/\d{2}\/\d{4})([\s\S]*?)(\d+\.\d{5})/;
		return regex.test(input);
	}

	private _split(text: string): string[] {
		const regex = /(\d{2}\/\d{2}\/\d{4}.*?)(?=\d{2}\/\d{2}\/\d{4}|$)/gs;
		const matches = text.match(regex);

		return matches ? matches.map((match) => match.trim()) : [];
	}

	private _extractInfo(input: string): Row {
		const regex = /(\d{2}\/\d{2}\/\d{4})([\s\S]*?)(\d+\.\d{5})/;

		const match = input.match(regex);

		if (!match) {
			throw new Error("Input does not match the expected format");
		}

		const date = match[1].trim().replace(/\//g, ".");
		const comment = match[2].trim();
		const value = -Number.parseFloat(match[3]);

		const row: Row = {
			date: ddmmyyyy(date),
			value,
			category: "other",
			comment: comment,
			currency: "GEL",
		};
		return row;
	}
}
