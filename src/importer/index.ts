import type { Either } from "../../lib/either";
import type { Scan } from "../scan";

export type Result = Either<string, Scan>;
export type Importer = (file: Uint8Array) => Promise<Result>;
