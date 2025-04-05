import { describe, expect, it } from "vitest";
import { CSVExporter } from "./index";
import type { Scan } from "~/scanner";
import type { Operation } from "~/operation";
import { right } from "~/either";
import type { Category } from "~/category";

describe("CSVExporter", () => {
	it("should export operations to CSV", async () => {
		const operations: Operation[] = [
			{
				date: new Date("2024-01-01"),
				value: 100,
				category: "food" as Category,
				comment: "Lunch",
				currency: "USD",
			},
			{
				date: new Date("2024-01-02"),
				value: -50,
				category: "transport" as Category,
				comment: "Taxi",
				currency: "USD",
			},
		];

		const mockScan: Scan = operations.map((operation) =>
			right({ operation, raw: "some raw data" }),
		);

		const exporter = new CSVExporter();
		const stream = exporter.export(mockScan);

		let result = "";
		for await (const chunk of stream) {
			result += new TextDecoder().decode(chunk);
		}

		const expected = `date,value,category,comment,currency
2024-01-01,100,food,Lunch,USD
2024-01-02,-50,transport,Taxi,USD
`;

		expect(result.trim()).toBe(expected.trim());
	});

	it("should handle empty scan", async () => {
		const mockScan: Scan = [];
		const exporter = new CSVExporter();

		const stream = exporter.export(mockScan);
		const reader = stream.getReader();
		const chunks: Uint8Array[] = [];

		let done = false;
		while (!done) {
			const result = await reader.read();
			done = result.done;
			if (!done && result.value) {
				chunks.push(result.value);
			}
		}

		const decoder = new TextDecoder();
		const output = chunks.map((chunk) => decoder.decode(chunk)).join("");

		// Should only contain the header
		expect(output.trim().split("\n").length).toBe(1);
		expect(output).toContain("date,value,category,comment,currency");
	});
});
