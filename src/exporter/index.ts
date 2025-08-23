import { Either } from "@/lib/either";
import { Scan } from "~/scan";

export type Result = Either<string, Uint8Array>;
export type Exporter = (scan: Scan) => Promise<Result>;
