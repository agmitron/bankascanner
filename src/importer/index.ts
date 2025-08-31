import type { Either } from "@/lib/either";
import type { Scan } from "~/scan";

export type Definition = {
	name: string;
	version: string;
	run: Importer;
};

export type Result = Either<string, Scan>;
export type Importer = (file: Uint8Array) => Promise<Result>;
export type Factory = () => Definition;
