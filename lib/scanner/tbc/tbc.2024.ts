import type { Scanner, Scan, Attempt } from "~/scanner";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { left, right } from "~/either";
import type { Statement } from "~/statement";

export class TBCV2024 implements Scanner {
	private previousBalance = 0;
	private _currency: string;

	constructor() {
		this._currency = "";
	}

	public scan(s: Statement): Scan {
		const pieces = this._split(s.content);

		this._determineCurrency(s.content);

		return pieces
			.filter((r) => this._isValidTransaction(r))
			.map((r) => this._parsePiece(r));
	}

	private _isValidTransaction(input: string): boolean {
		const regex = /(\d{2}\/\d{2}\/\d{4})([\s\S]*?)(\d+\.\d{5})/;
		return regex.test(input);
	}

	private _split(text: string): string[] {
		const regex = /(\d{2}\/\d{2}\/\d{4}.*?)(?=\d{2}\/\d{2}\/\d{4}|$)/gs;
		const matches = text.match(regex);

		if (matches) {
			return matches.map((match) => match.trim());
		}

		return [];
	}

	private _parsePiece(piece: string): Attempt {
		const regex =
			/(\d{2}\/\d{2}\/\d{4})(([\s\S]*?))(?=\d+\.\d{5})(\d+\.\d{2})(\d+\.\d{2})/;

		const match = piece.match(regex);

		if (!match) {
			return left({ piece });
		}

		const date = match[1].trim().replace(/\//g, ".");
		const comment = match[2].trim();
		const currentBalance = Number.parseFloat(match[5]).toFixed(2);
		const currentBalanceNum = Number.parseFloat(currentBalance);

		const transactionValue = Number.parseFloat(match[4]);

		const value =
			currentBalanceNum > this.previousBalance
				? transactionValue
				: -transactionValue;

		this.previousBalance = currentBalanceNum;

		const operation: Operation = {
			date: ddmmyyyy(date),
			value: Number(value.toFixed(2)),
			category: "other",
			comment: comment,
			currency: this._currency,
		};

		return right({ operation });
	}
	private _determineCurrency(input: string): string {
		const currencyRegex =
			/(?:Opening Balance|Closing Balance)[^\d]*(\d[\d,]*\.\d{2})\s*([A-Z]{3})/;
		const match = input.match(currencyRegex);

		if (match) {
			this._currency = match[2];
		} else {
			console.log("No currency found");
			this._currency = "";
		}

		return this._currency;
	}
}
