import type { Either } from "@/lib/either";
import type { Scan } from "~/scan";

export type Definition = {
	name: string;
	version: string;
	run: Exporter;
};

export type Result = Either<string, Uint8Array>;
export type Exporter = (scan: Scan) => Promise<Result>;
export type Factory = () => Definition;
