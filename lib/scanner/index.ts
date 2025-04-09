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
import type { Statement } from "~/statement";

export const defaultScanners: Record<string, Versioner<string>> = {
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

export type Attempt = Either<Failure, Success>;

/**
 * Represents a collection of attempts.
 *
 * Some operations might be parsed successfully, but some might not.
 *
 * Using a collection is convenient to handle both cases and keep the order of operations.
 */
export type Scan = Iterable<Attempt>;

export interface Scanner {
	/**
	 * Scans the provided statement and returns the result.
	 * @param statement The statement to scan.
	 * @returns The scanned data.
	 */
	scan(statement: Statement): Scan;
}

/**
 * 
 * @param bank The bank name.
 * @param version Version of the bank statement.
 * @param statement The statement to be scanned.
 * @param _scanners The scanners to use. If not provided, the default scanners will be used.
 * @returns The scanned rows. Some of them might be failed to be parsed.
 * @throws {UnknownVersionError} If the version is not supported.
 * @throws {UnknownBankError} If the bank is not supported.
 */
export const run = (
	bank: string, 
	version: string, 
	statement: Statement,
	_scanners = defaultScanners,
) => {
	const scanner = get(bank, version, _scanners);
	if (!scanner) {
		throw new UnknownVersionError(version, bank);
	}

	return scanner.scan(statement);
};

/**
 * 
 * @param _scanners Scanners to use. If not provided, the default scanners will be used.
 * @returns An array of bank names.
 */
export const choices = (_scanners = defaultScanners) => Object.keys(_scanners);

/**
 * 
 * @param bank The bank name.
 * @param version The version of the bank statement.
 * @param _scanners The scanners to use. If not provided, the default scanners will be used.
 * @returns Either the scanner or null.
 * @throws {UnknownBankError} If the bank is not supported.
 */
export const get = (
	bank: string,
	version = DEFAULT_VERSION,
	_scanners = defaultScanners,
): Scanner | null => {
	const versioner = _scanners[bank];
	if (!versioner) {
		throw new UnknownBankError(bank);
	}

	return versioner.choose(version);
};
