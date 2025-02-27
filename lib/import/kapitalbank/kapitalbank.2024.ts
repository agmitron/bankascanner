import pdf2data from "pdf-parse";
import type { Attempt, Importer, Result } from "~/import";
import type { Operation } from "~/row";
import {
	type Category,
	type CategoryDetectors,
	detectCategory,
} from "~/category";
import { left, right } from "~/either";

const categoryDetectors: CategoryDetectors = new Map([
	["other", [(s) => true]],
]);

interface Profile {
	name: string;
	account: string;
	currency: string;
}

// Takes a string, changes it and returns a new string.
// Can do side-effects.
type Preparator = (s: string) => string;

interface Extractor {
	regex: RegExp;
	index: number;
}

/**
 * Parses KapitalBank statements of the 2024 version.
 */
export class KapitalBankV2024 implements Importer {
	private _profile: Profile | null = null;

	public async import(file: Buffer): Promise<Result> {
		const data = await pdf2data(file);
		const prepared = this._prepare(data.text);
		const pieces = this._split(prepared);
		return pieces.map((p) => this._parsePiece(p));
	}

	private _prepare(data: string): string {
		const preparators: Preparator[] = [
			(v) => {
				const lines = v.split("\n");
				const indexOfTitle = lines.findIndex((l) =>
					l.includes("Transaction amountDetails"),
				);

				const result = lines.slice(indexOfTitle + 1).join("\n");
				return result;
			},
			(v) => this._extractProfile(v),
			(v) => v.replaceAll(bankInfo, ""),
			(v) => v.replaceAll(footer, ""),
		];

		return preparators.reduce((acc, p) => p(acc), data);
	}

	private _split(data: string): string[] {
		const withoutEmptyLines = data.replaceAll(/^\s*\n/gm, "");

		const matches = withoutEmptyLines.match(
			/(\d{2}\.\d{2}\.\d{4}\d{2}\.\d{2}\.\d{4})(.\n?)*?(?=(\d{2}\.\d{2}\.\d{4}\d{2}\.\d{2}\.\d{4})|$)/gm,
		);

		if (!matches) {
			return [];
		}

		const pieces: string[] = [];
		for (const m of matches) {
			const index = data.indexOf(m);
			const piece = data.slice(index, index + m.length);
			pieces.push(piece.trim());
		}

		return pieces;
	}

	private _extractProfile(data: string): string {
		const r = new RegExp(
			/(\w+\s\w+)\s+\n?Account number: (\d*)\s+\n?Account currency: (.*)/gm,
		);

		const match = r.exec(data);

		const name = match?.[1] ?? "";
		const account = match?.[2] ?? "";
		const currency = match?.[3] ?? "";

		this._profile = {
			name,
			account,
			currency,
		};

		return data.replaceAll(r, "");
	}

	private _parsePiece(piece: string): Attempt {
		if (!this._profile) {
			return left({ piece, reason: "profile is not set" })
		}

		const date = this._getDate(piece);
		const value = this._getValue(piece);
		const comment = this._getComment(piece);
		const category = this._getCategory(piece);
		const currency = this._profile.currency;

		const operation = {
			date,
			value,
			comment,
			category,
			currency,
		}

		return right({ operation });
	}

	private _getComment(piece: string): string {
		const onlyValueAndComment = piece.replace(
			/(\d{2}\.\d{2}\.\d{4}\d{2}\.\d{2}\.\d{4})\d{7,8}/gm,
			"",
		);
		const value = this._getValue(piece);

		const valueWithDecimals = value.toFixed(2); // 100.00 instead of just 100
		const onlyComment = onlyValueAndComment
			.replace(valueWithDecimals, "")
			.trim();
		return onlyComment;
	}

	private _getCategory(piece: string): Category {
		return detectCategory(categoryDetectors, piece);
	}

	private _getDate(piece: string): Date {
		const matches = /\d{2}\.\d{2}\.\d{4}(\d{2}\.\d{2}\.\d{4})/gm.exec(piece);
		if (!matches) {
			throw new Error(`Could not parse date from line: ${piece}`);
		}

		const date = matches[1];
		const [day, month, year] = date
			.split(".")
			.map((v) => Number.parseInt(v, 10));

		return new Date(`${year}-${month}-${day}`);
	}

	private _getValue(piece: string): number {
		const dateWidth = 10; // "02.02.2024".length
		const withoutDate = piece.slice(dateWidth * 2);

		const extractors: Extractor[] = [
			{
				// common cases
				regex: new RegExp(/\d{7,8}(-?\d[\d\s]+\.\d{2}).*/),
				index: 1,
			},
			{
				// L1654 589.00
				regex: new RegExp(/(^[A-Z])\d{3}((-?\d[\d\s]+\.\d{2}).*)/),
				index: 3,
			},
			{
				// 1575037-7.08
				regex: new RegExp(/\d{7,8}(-?\d.\d{2}).*/),
				index: 1,
			},
		];

		let result: string | null = null;
		for (const { regex, index } of extractors) {
			result = regex.exec(withoutDate)?.[index] ?? null;
			if (result) {
				break;
			}
		}

		if (!result) {
			throw new Error(`Could not parse value from line: ${piece}`);
		}

		const numberWithoutSpaces = result.replace(/\s/g, "");
		return Number.parseFloat(numberWithoutSpaces);
	}
}

const bankInfo = `
Joint Stock Commercial Bank “Kapitalbank”.  
Address: Uzbekistan, 100047, city of Tashkent, Sayilgokh, 7  
+998(71)200-15-15, info@kapitalbank.uz.  
Bank code MFO: 01088.  
SWIFT: KACHUZ22.
`.trim();

const footer = `
Head of the Retail OperationsLebedenko E.P.
Single branch JSCB "Kapitalbank" 
`.trim();
