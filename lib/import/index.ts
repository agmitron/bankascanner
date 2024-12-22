import type { Versioner } from "~/entities/import";
import * as kapitalbank from "~/import/kapitalbank";
import * as tinkoff from "~/import/tinkoff";

export const versioners: Record<string, Versioner<string>> = {
	kapitalbank: new kapitalbank.Versioner(),
	tinkoff: new tinkoff.Versioner(),
} as const;
