Object.defineProperty(exports, "__esModule", { value: true });
exports.right = exports.left = void 0;
class Left {
	constructor(value) {
		this.value = value;
		this.tag = "Left";
	}
	isLeft() {
		return true;
	}
	isRight() {
		return false;
	}
	map(_) {
		return new Left(this.value);
	}
	flatMap(_) {
		return new Left(this.value);
	}
}
class Right {
	constructor(value) {
		this.value = value;
		this.tag = "Right";
	}
	isLeft() {
		return false;
	}
	isRight() {
		return true;
	}
	map(f) {
		return new Right(f(this.value));
	}
	flatMap(f) {
		return f(this.value);
	}
}
const left = (value) => new Left(value);
exports.left = left;
const right = (value) => new Right(value);
exports.right = right;
//# sourceMappingURL=either.js.map
