import {
	DEFAULT_VERSION,
	type Importer,
	UnknownBankError,
	UnknownVersionError,
} from "~/entities/import";
import { versioners } from "~/import";

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
