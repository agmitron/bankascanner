export class UnknownBankError extends Error {
	constructor(bank: string) {
		super(`Unknown bank ${bank}`);
	}
}

export class UnknownVersionError extends Error {
	constructor(version: string, bank: string) {
		super(`Unknown version ${version} for bank ${bank}`);
	}
}