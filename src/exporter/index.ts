import type { Either } from "@/lib/either";
import type { Scan } from "~/scan";

export type Result = Either<string, Uint8Array>;
export type Exporter = (scan: Scan) => Promise<Result>;
