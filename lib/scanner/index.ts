import * as kapitalbank from "~/scanner/kapitalbank";
import * as tinkoff from "~/scanner/tinkoff";
import * as jusan from "~/scanner/jusan";
import * as tbc from "~/scanner/tbc";
import type { Operation } from "~/operation";
import {
	DEFAULT_VERSION,
	UnknownVersionError,
	type Versioner,
} from "~/scanner/version";
import { UnknownBankError } from "~/bank";
import type { Either } from "~/either";

export const scanners: Record<string, Versioner<string>> = {
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

export type Result = Iterable<Attempt>;

export interface Scanner {
	scan(file: Buffer): Promise<Result>;
}

export const run = (bank: string, version: string, pdf: Buffer) => {
	const scanner = get(bank, version);
	if (!scanner) {
		throw new UnknownVersionError(version, bank);
	}

	return scanner.scan(pdf);
};

export const choices = () => Object.keys(scanners);

export const get = (
	bank: string,
	version = DEFAULT_VERSION,
): Scanner | null => {
	const versioner = scanners[bank];
	if (!versioner) {
		throw new UnknownBankError(bank);
	}

	return versioner.choose(version);
};
