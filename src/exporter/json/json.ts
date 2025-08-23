import { left, right } from "@/lib/either";
import { Exporter, Result } from "~/exporter";
import { Scan } from "~/scan";

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
