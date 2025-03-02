import {
	DEFAULT_VERSION,
	type Version,
	type Versioner as IVersioner,
} from "~/scanner/version";
import { TBCV2024 } from "./tbc.2024";

type TBCVersion = Version<"2024">; // add more versions as union here if needed

const versions: TBCVersion[] = [DEFAULT_VERSION, "2024"];

export class Versioner implements IVersioner<TBCVersion> {
	public get supported() {
		return versions;
	}

	public async guess(_: Buffer): Promise<TBCVersion> {
		return DEFAULT_VERSION;
	}

	public choose(v: TBCVersion) {
		switch (v) {
			case DEFAULT_VERSION:
			case "2024":
				return new TBCV2024();
			default:
				throw new Error(`Unknown version: ${v}`);
		}
	}
}
