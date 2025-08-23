export { type Either, left, right };
type Either<L, R> = Left<L, R> | Right<L, R>;
declare class Left<L, R> {
	readonly value: L;
	readonly tag = "Left";
	constructor(value: L);
	isLeft(): this is Left<L, R>;
	isRight(): this is Right<L, R>;
	map<U>(_: (r: R) => U): Either<L, U>;
	flatMap<U>(_: (r: R) => Either<L, U>): Either<L, U>;
}
declare class Right<L, R> {
	readonly value: R;
	readonly tag = "Right";
	constructor(value: R);
	isLeft(): this is Left<L, R>;
	isRight(): this is Right<L, R>;
	map<U>(f: (r: R) => U): Either<L, U>;
	flatMap<U>(f: (r: R) => Either<L, U>): Either<L, U>;
}
declare const left: <L, R>(value: L) => Either<L, R>;
declare const right: <L, R>(value: R) => Either<L, R>;
//# sourceMappingURL=either.d.ts.map
