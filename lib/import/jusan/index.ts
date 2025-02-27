import {
	DEFAULT_VERSION,
	type Versioner as IVersioner,
	type Version,
} from "~/version";
import { JusanV2024 } from "./jusan.2024";

type JusanVersion = Version<"2024">; // add more versions here if needed

const versions: JusanVersion[] = [DEFAULT_VERSION, "2024"];

export class Versioner implements IVersioner<JusanVersion> {
	public get supported() {
		return versions;
	}

	public async guess(_: Buffer): Promise<JusanVersion> {
		return DEFAULT_VERSION;
	}

	public choose(v: JusanVersion) {
		switch (v) {
			case DEFAULT_VERSION:
			case "2024":
				return new JusanV2024();
			default:
				throw new Error(`Unknown version: ${v}`);
		}
	}
}
