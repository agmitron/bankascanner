export class UnknownBankError extends Error {
	constructor(bank: string) {
		super(`Unknown bank ${bank}`);
	}
}
