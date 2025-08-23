import type { Either } from "../lib/either";
import type { Operation } from "./operation";

export type Failure = {
	fields?: Record<keyof Operation, string>;
	message: string;
};

export type Outcome = Either<Failure, Operation>;
export type Scan = Iterable<Outcome>;
