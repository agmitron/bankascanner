import pdf2data from "pdf-parse";
import { otherCurrency } from "~/currency";
import type { Scanner, Attempt, Result } from "~/scanner";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { left, right } from "~/either";

// date for correct data match
const FAKE_DATE = `10.10.1010
08:32`;

export class JusanV2024 implements Scanner {
	public async scan(file: Buffer): Promise<Result> {
		const data = await pdf2data(file);
		const pieces = this._split(data.text);

		const result = pieces.map((r) => this._parsePiece(r));
		return result;
	}

	private _split(text: string): string[] {
		const data = `${text}\n${FAKE_DATE}`;

		const mainRe =
			/(\d{2}\.\d{2}\.\d{4}\s*\n\d{2}:\d{2}:\d{2}\n[\s\S]*?)(?=\d{2}\.\d{2}\.\d{4})/gm;
		const lastRe =
			/(\d{2}\.\d{2}\.\d{4}\s*IM\s*.*?\d{2}\.\d{2}\.\d{4}[\s\S]*?)(?=\d{2}\.\d{2}\.\d{4}|$)/gm;

		const mainMatches = data.match(mainRe) || [];
		const lastMatches = data.match(lastRe) || [];

		const allMatches = [...mainMatches, ...lastMatches].map((match) =>
			match.trim(),
		);

		const sortedMatches = allMatches.sort((a, b) => {
			const dateAMatch = a.match(/(\d{2}\.\d{2}\.\d{4})/);
			const dateBMatch = b.match(/(\d{2}\.\d{2}\.\d{4})/);

			if (dateAMatch && dateBMatch) {
				const dateA = new Date(dateAMatch[0]);
				const dateB = new Date(dateBMatch[0]);
				return dateA.getTime() - dateB.getTime();
			}

			return 0;
		});

		return sortedMatches;
	}

	private _parsePiece(piece: string): Attempt {
		try {
			const regex =
				/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2}:\d{2})\s+([\s\S]+?)\s+Референс:\s+(\d+)\s+Код авторизации:\s+(\d+)\s+([\s\S]*?)(\d+(\.\d{2})?)([A-Z]{3})/;

			const match = piece.match(regex);

			if (!match) {
				return this._parsePiece2(piece);
			}

			const date = match[1];
			const time = match[2];
			const comment = match[3].trim();
			const reference = `Референс: ${match[4]}`;
			const authorizationCode = `Код авторизации: ${match[5]}`;
			const additionalInfo = match[6].trim();
			const value = -Number.parseFloat(match[7]);
			const currency = match[9];

			const commentParts = [comment];

			if (!commentParts.includes(reference)) {
				commentParts.push(reference);
			}
			if (!commentParts.includes(authorizationCode)) {
				commentParts.push(authorizationCode);
			}
			if (additionalInfo) {
				commentParts.push(additionalInfo);
			}

			const formattedComment = commentParts.join("\n").trim();

			const row: Operation = {
				date: ddmmyyyy(date, time),
				value,
				category: "other",
				comment: formattedComment,
				currency,
			};

			return right({ operation: row });
		} catch (error) {
			return left({ piece });
		}
	}
	private _parsePiece2(piece: string): Attempt {
		const regex =
			/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2}:\d{2})\s+([\s\S]*)^(\d+\.\d{2})(\w{3})/m;

		const match = piece.match(regex);
		if (!match) {
			return left({ piece });
		}

		const [_, date, time, text, value, currency] = match;

		const operation: Operation = {
			date: ddmmyyyy(date, time),
			comment: text.trim(),
			value: -Number.parseFloat(value),
			category: "other",
			currency,
		};

		return right({ operation });
	}
}
