import * as kapitalbank from "~/import/kapitalbank";
import * as tinkoff from "~/import/tinkoff";
import * as jusan from "~/import/jusan";
import * as tbc from "~/import/tbc";
import type { Operation } from "~/row";
import {
	DEFAULT_VERSION,
	UnknownVersionError,
	type Versioner,
} from "~/version";
import { UnknownBankError } from "~/bank";
import type { Either } from "~/either";

export const versioners: Record<string, Versioner<string>> = {
	kapitalbank: new kapitalbank.Versioner(),
	tinkoff: new tinkoff.Versioner(),
	jusan: new jusan.Versioner(),
	tbc: new tbc.Versioner(),
} as const;

export interface Failure {
	/** The string that is considered as a row in the given bank statement,
	 * but failed to be parsed.
	 */
	piece: string;

	/** The specific field that left unparsed.
	 */
	field?: keyof Operation;

	/** The reason why the parsing failed. */
	reason?: string;
}

export interface Success {
	operation: Operation;
}

// TODO: better naming?
export type Attempt = Either<Failure, Success>;

export type Result = Attempt[];

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
