import type { Statement } from "~/statement";
import type { Subscriber } from "~/subscriber";

export interface Progress {
	bytes: number;
}

export type Event = "progress";

export interface Importer extends Subscriber<Event, Progress> {
	import(file: ReadableStream<Uint8Array>): Promise<Statement>;
}
