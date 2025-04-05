import { otherCurrency } from "~/currency";
import type { Attempt, Scanner, Scan } from "~/scanner";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { left, right } from "~/either";
import type { Statement } from "~/statement";

// date for correct data match
const FAKE_DATE = `10.10.1010
08:32`;

export class TinkoffV2024 implements Scanner {
	public scan(s: Statement): Scan {
		const pieces = this._split(s.content);
		return pieces.map((r) => this._parsePiece(r));
	}

	private _split(text: string): string[] {
		// add fake date for last element of data array
		const data = `${text}
        ${FAKE_DATE}`;

		const re =
			/(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}([\n\s]*)\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})([\s\S]*?)(?=\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})/gm;
		const matches = data.matchAll(re);

		if (!matches) {
			return [];
		}

		const pieces: string[] = [...matches].map(([m]) => m.trim());

		return pieces;
	}

	private _parsePiece(piece: string): Attempt {
		const regex =
			/((\d{2}\.\d{2}\.\d{4})\s*(\d{2}:\d{2})\s*){2}((\+|\-)(\d+\s?\d+.\d{2})\s(.)){2}((.*\n?)*)/;
		const match = piece.match(regex);

		if (!match) {
			return left({ piece });
		}

		const dateStr = match[2].trim();
		const time = match[3].trim();
		const valueStr = match[6].trim();
		const comment = match[8].trim().replaceAll("\n", " ");
		const currency = match[7];
		const operator = match[5].trim();

		const card = comment.match(/(?=(.*\s?)(\d{4}|—))/);
		if (!card) {
			return left({ piece, field: "comment" });
		}

		const commentWithoutCard = comment.replace(card[2], "").trim();

		let value = Number.parseFloat(valueStr.replace(/[\s₽]/g, ""));
		if (operator === "-") {
			value = value * -1;
		}

		const operation: Operation = {
			date: ddmmyyyy(dateStr, time),
			value,
			category: "other",
			comment: commentWithoutCard,
			currency: currencyMapping[currency] ?? otherCurrency,
		};

		return right({ operation });
	}
}
const currencyMapping: Record<string, string> = {
	"₽": "RUB",
	$: "USD",
	"€": "EUR",
};
