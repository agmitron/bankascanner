type Subscription = (size: number) => void;
type Cancellation = () => void;

/**
 * Reader is an async iterable that loads data from a source and notifies subscribers about the amount of bytes read.
 */
export interface Loader extends AsyncIterable<Uint8Array> {
	subscribe(sub: Subscription): Cancellation;
}

export class FileLoader implements Loader {
	private _stream: ReadableStream<Uint8Array>;
	private _subscribers: Subscription[] = [];

	constructor(stream: ReadableStream<Uint8Array>) {
		this._stream = stream;
	}

	public subscribe(sub: Subscription): Cancellation {
		this._subscribers.push(sub);

		return () => {
			this._subscribers = this._subscribers.filter((s) => s !== sub);
		};
	}

	[Symbol.asyncIterator]() {
		const stream = this._stream;
		const reader = stream.getReader();

		return {
			next: async () => {
				const { done, value } = await reader.read();
				if (done) {
					return { done: true, value: new Uint8Array() };
				}

				this._notify(value.length);
				return { done: false, value };
			},
		};
	}

	private _notify(size: number) {
		for (const cb of this._subscribers) {
			cb(size);
		}
	}
}
