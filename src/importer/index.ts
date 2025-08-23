import { Either } from "../../lib/either";
import { Scan } from "../scan";

export type Result = Either<string, Scan>;
export type Importer = (file: Uint8Array) => Promise<Result>;
