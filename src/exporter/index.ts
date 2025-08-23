import * as json from "~/exporter/json";
import type { Either } from "@/lib/either";
import type { Scan } from "~/scan";

export type Result = Either<string, Uint8Array>;
export type Exporter = (scan: Scan) => Promise<Result>;

export const core = {
	json,
} as const;
