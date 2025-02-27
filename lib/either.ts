export { type Either, left, right };

type Either<L, R> = Left<L, R> | Right<L, R>;

class Left<L, R> {
	readonly tag = "Left";
	constructor(public readonly value: L) {}

	isLeft(): this is Left<L, R> {
		return true;
	}

	isRight(): this is Right<L, R> {
		return false;
	}

	map<U>(_: (r: R) => U): Either<L, U> {
		return new Left(this.value);
	}

	flatMap<U>(_: (r: R) => Either<L, U>): Either<L, U> {
		return new Left(this.value);
	}
}

class Right<L, R> {
	readonly tag = "Right";
	constructor(public readonly value: R) {}

	isLeft(): this is Left<L, R> {
		return false;
	}

	isRight(): this is Right<L, R> {
		return true;
	}

	map<U>(f: (r: R) => U): Either<L, U> {
		return new Right<L, U>(f(this.value));
	}

	flatMap<U>(f: (r: R) => Either<L, U>): Either<L, U> {
		return f(this.value);
	}
}

const left = <L, R>(value: L): Either<L, R> => new Left(value);
const right = <L, R>(value: R): Either<L, R> => new Right(value);
