import {
	DEFAULT_VERSION,
	type Version,
	type Versioner as IVersioner,
} from "~/version";
import { TbcV2024 } from "./tbc.2024";

type TbcVersion = "2024"; // add more versions here if needed

const versions: Version<TbcVersion>[] = [DEFAULT_VERSION, "2024"];

export class Versioner implements IVersioner<TbcVersion> {
	public get supported() {
		return versions;
	}

	public async guess(_: Buffer): Promise<Version<TbcVersion>> {
		return DEFAULT_VERSION;
	}

	public choose(v: Version<TbcVersion>) {
		switch (v) {
			case DEFAULT_VERSION:
			case "2024":
				return new TbcV2024();
			default:
				throw new Error(`Unknown version: ${v}`);
		}
	}
}
