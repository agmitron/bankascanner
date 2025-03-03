import type { Exporter } from "~/exporter";
import type { Scan } from "~/scanner";

export class JSONExporter implements Exporter {
	private isFirstItem = false;

	constructor(public readonly canFail: boolean) {}

	export(scan: Scan): ReadableStream<Uint8Array> {
		const encoder = new TextEncoder();
		const iterator = scan[Symbol.iterator]();

		return new ReadableStream({
			start: (controller) => {
				controller.enqueue(encoder.encode("[\n"));
				this.isFirstItem = true;
			},

			pull: (controller) => {
				// Get the next item
				const result = iterator.next();

				if (result.done) {
					// End of data, close the array and the stream
					controller.enqueue(encoder.encode("\n]"));
					controller.close();
					return;
				}

				const attempt = result.value;

				if (attempt.isLeft() && !this.canFail) {
					throw new Error(`Failed to parse a piece: ${attempt.value.piece}`);
				}

				// Add comma for all but the first item
				if (!this.isFirstItem) {
					controller.enqueue(encoder.encode(",\n"));
				} else {
					this.isFirstItem = false;
				}

				// Encode and enqueue the JSON data
				const data = JSON.stringify(attempt.value);
				controller.enqueue(encoder.encode(data));
			},
		});
	}
}
