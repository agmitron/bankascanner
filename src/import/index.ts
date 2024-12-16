import {
	UnknownBankError,
	type Version,
	type Versioner,
} from "~/entities/import";
import * as kapitalbank from "./kapitalbank";
import * as tinkoff from "./tinkoff";

const versioners: Record<string, Versioner<Version<string>>> = {
	kapitalbank: new kapitalbank.Versioner(),
	tinkoff: new tinkoff.Versioner(),
} as const;

export const run = (bank: string, version: string, pdf: Buffer) => {
	const versioner = versioners[bank];
	if (!versioner) {
		throw new Error(`Unknown bank: ${bank}`);
	}

	const supported = versioner.supported;
	if (!supported.includes(version)) {
		throw new Error(`Unknown version: ${version}`);
	}

	const importer = versioner.choose(version);
	return importer.import(pdf);
};

export const choices = () => Object.keys(versioners);

export const supports = (bank: string) => {
	if (!versioners[bank]) {
		throw new UnknownBankError(bank);
	}

	return true;
};
