import {
	DEFAULT_VERSION,
	type Versioner as IVersioner,
	type Version,
} from "~/scanner/version";
import { KapitalBankV2024 } from "./kapitalbank.2024";

type KapitalbankVersion = Version<"2024">; // add more versions here if needed

const versions: KapitalbankVersion[] = [DEFAULT_VERSION, "2024"];

export class Versioner implements IVersioner<KapitalbankVersion> {
	public get supported() {
		return versions;
	}

	public async guess(_: Buffer): Promise<Version<KapitalbankVersion>> {
		return DEFAULT_VERSION;
	}

	public choose(v: Version<KapitalbankVersion>) {
		switch (v) {
			case DEFAULT_VERSION:
			case "2024":
				return new KapitalBankV2024();
			default:
				throw new Error(`Unknown version: ${v}`);
		}
	}
}
