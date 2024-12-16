import {
	DEFAULT_VERSION,
	type Version,
	type Versioner as IVersioner,
} from "~/entities/import";
import { TinkoffV2024 } from "./tinkoff.2024";

export { TinkoffV2024 as Tinkoff } from "./tinkoff.2024";

type TinkoffVersion = "2024"; // add more versions here if needed

const versions: Version<TinkoffVersion>[] = [DEFAULT_VERSION, "2024"];

export class Versioner implements IVersioner<TinkoffVersion> {
	public get supported() {
		return versions;
	}

	public async guess(_: Buffer): Promise<Version<TinkoffVersion>> {
		return DEFAULT_VERSION;
	}

	public choose(v: Version<TinkoffVersion>) {
		switch (v) {
			case DEFAULT_VERSION:
			case "2024":
				return new TinkoffV2024();
			default:
				throw new Error(`Unknown version: ${v}`);
		}
	}
}
