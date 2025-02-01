import * as kapitalbank from "~/import/kapitalbank";
import * as tinkoff from "~/import/tinkoff";
import * as credo from "~/import/credo";

import { UnknownBankError, UnknownVersionError } from "~/error";
import type { Row } from "~/row";
import { DEFAULT_VERSION, type Versioner } from "~/version";

import defaultPDF2Text from 'pdf-parse'
import type { Category } from "~/category";

export const versioners: Record<string, Versioner<string>> = {
	kapitalbank: new kapitalbank.Versioner(),
	tinkoff: new tinkoff.Versioner(),
	// credo: new credo.Versioner(),
} as const;

export interface Importer {
	import(file: Buffer): Promise<Row[]>;
}

export const run = (bank: string, version: string, pdf: Buffer) => {
	const importer = get(bank, version);
	if (!importer) {
		throw new UnknownVersionError(version, bank);
	}

	return importer.import(pdf);
};

export const choices = () => Object.keys(versioners);

export const get = (
	bank: string,
	version = DEFAULT_VERSION,
): Importer | null => {
	const versioner = versioners[bank];
	if (!versioner) {
		throw new UnknownBankError(bank);
	}

	return versioner.choose(version);
};

// TODO: naming
interface BuildParams {
	name: string;
	extractors: {
		pdf2text?: (pdf: Buffer) => Promise<string>;

		text2pieces: (full: string) => string[];
		piece2row: {
			date: (piece: string) => Date;
			comment: (piece: string) => string;
			amount: (piece: string) => number;
			category: (piece: string) => Category;
			currency: (piece: string) => string;
		}
	}
}

export const build = (
	{
		extractors: {
			pdf2text = (pdf: Buffer) => defaultPDF2Text(pdf).then(data => data.text),
			text2pieces,
			piece2row,
		},
		name,
	}: BuildParams
): new () => Importer => {
	const Implementation = class implements Importer {
		async import(file: Buffer): Promise<Row[]> {
			const text = await pdf2text(file);
			const pieces = text2pieces(text);

			const rows = pieces.map(piece => {
				const date = piece2row.date(piece);
				const comment = piece2row.comment(piece);
				const value = piece2row.amount(piece);
				const category = piece2row.category(piece);
				const currency = piece2row.currency(piece);

				return { date, comment, value, category, currency };
			});

			return rows;
		}
	}

	// For debugging purposes
	Object.defineProperty(Implementation, 'name', { value: name });

	return Implementation;
}