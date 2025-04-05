import {
	DEFAULT_VERSION,
	type Version,
	type Versioner as IVersioner,
} from "~/scanner/version";
import { TinkoffV2024 } from "./tinkoff.2024";
import type { Statement } from "~/statement";

type TinkoffVersion = Version<"2024">; // add more versions here if needed

const versions: TinkoffVersion[] = [DEFAULT_VERSION, "2024"];

export class Versioner implements IVersioner<TinkoffVersion> {
	public get supported() {
		return versions;
	}

	public guess(s: Statement): TinkoffVersion {
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
