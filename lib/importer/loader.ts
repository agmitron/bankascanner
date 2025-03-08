type Subscription = (index: number, size: number, totalSize: number) => void;
type Cancellation = () => void;

/**
 * An async iterable that reads data from a source and notifies subscribers about the amount of bytes read.
 */
export interface Loader extends AsyncIterable<Uint8Array> {
	subscribe(s: Subscription): Cancellation;
}

export class StreamLoader implements Loader {
	private readonly _iterable: AsyncIterable<Uint8Array>;
	private _subscriptions: Set<Subscription> = new Set();

	constructor(iterable: AsyncIterable<Uint8Array>) {
		this._iterable = iterable;
	}

	public subscribe(s: Subscription): Cancellation {
		this._subscriptions.add(s);

		return () => {
			this._subscriptions.delete(s);
		};
	}

	async *[Symbol.asyncIterator]() {
		let index = -1
		let totalBytesRead = 0;

		for await (const chunk of this._iterable) {
			index += 1
			totalBytesRead += chunk.length;
			this._notify(index, chunk.length, totalBytesRead);
			
			yield chunk;
		}
	}

	private _notify(index: number, size: number, totalSize: number) {
		for (const cb of this._subscriptions) {
			cb(index, size, totalSize);
		}
	}
}
