import * as kapitalbank from "~/import/kapitalbank";
import * as tinkoff from "~/import/tinkoff";
import * as jusan from "~/import/jusan";
import { UnknownBankError, UnknownVersionError } from "~/error";
import type { Operation } from "~/operation";
import { DEFAULT_VERSION, type Versioner } from "~/version";
import type { Either } from "fp-ts/lib/Either";

export const versioners: Record<string, Versioner<string>> = {
	kapitalbank: new kapitalbank.Versioner(),
	tinkoff: new tinkoff.Versioner(),
	jusan: new jusan.Versioner(),
} as const;

export class ParseError extends Error {
	public readonly piece: string;

	constructor(piece: string) {
		super(`Failed to parse: ${piece}`);
		this.piece = piece;
	}
}

export type Result = Either<ParseError, Operation>[];

export interface Importer {
	import(file: Buffer): Promise<Result>;
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
