type Subscription = (bytesRead: number) => void;
type Cancellation = () => void;

/**
 * An async iterable that reads data from a source and notifies subscribers about the amount of bytes read.
 */
export interface Subscriber extends AsyncIterable<Uint8Array> {
	subscribe(sub: Subscription): Cancellation;
}

export class Reader implements Subscriber {
	private readonly _stream: ReadableStream<Uint8Array>;
	private _subscriptions: Set<Subscription> = new Set();

	constructor(stream: ReadableStream<Uint8Array>) {
		this._stream = stream;
	}

	public subscribe(s: Subscription): Cancellation {
		this._subscriptions.add(s);

		return () => {
			this._subscriptions.delete(s);
		};
	}

	[Symbol.asyncIterator]() {
		const stream = this._stream;
		const reader = stream.getReader();

		let bytesRead = 0;
		return {
			next: async () => {
				const { done, value } = await reader.read();
				if (done) {
					return { done: true, value: new Uint8Array() };
				}

				bytesRead += value.length;
				this._notify(bytesRead);
				return { done: false, value };
			},
		};
	}

	private _notify(bytesRead: number) {
		for (const cb of this._subscriptions) {
			cb(bytesRead);
		}
	}
}
