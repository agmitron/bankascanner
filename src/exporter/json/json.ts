import { left, right } from "@/lib/either";
import type { Exporter, Result } from "~/exporter";
import type { Scan } from "~/scan";

export function create(): Exporter {
	return (s: Scan): Promise<Result> => {
		try {
			const json = JSON.stringify(s);
			const encoder = new TextEncoder();
			return Promise.resolve(right(encoder.encode(json)));
		} catch (e) {
			return Promise.resolve(left("Failed to serialize JSON."));
		}
	};
}
