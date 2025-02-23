import * as kapitalbank from "~/import/kapitalbank";
import * as tinkoff from "~/import/tinkoff";
import * as jusan from "~/import/jusan";
import * as tbc from "~/import/tbc";
import { UnknownBankError, UnknownVersionError } from "~/error";
import type { Row } from "~/row";
import { DEFAULT_VERSION, type Versioner } from "~/version";

export const versioners: Record<string, Versioner<string>> = {
	kapitalbank: new kapitalbank.Versioner(),
	tinkoff: new tinkoff.Versioner(),
	jusan: new jusan.Versioner(),
	tbc: new tbc.Versioner(),
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
