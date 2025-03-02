import { describe, expect, it } from "vitest";
import { ddmmyyyy } from "~/date";
import { left, right } from "~/either";
import type { Scan } from "~/scanner";
import { JSONExporter } from "./json";

describe("JSONExporter", () => {
    it("returns a stream that can be read", async () => {
        const scan: Scan = [
            right({ operation: { date: ddmmyyyy("01.01.2024", "04:00:00"), value: 1, currency: "GEL", category: 'entertainment', comment: "some_comment" } }),
            right({ operation: { date: ddmmyyyy("01.01.2024", "04:00:00"), value: 1, currency: "GEL", category: 'entertainment', comment: "some_comment" } }),
            right({ operation: { date: ddmmyyyy("01.01.2024", "04:00:00"), value: 1, currency: "GEL", category: 'entertainment', comment: "some_comment" } }),
            right({ operation: { date: ddmmyyyy("01.01.2024", "04:00:00"), value: 1, currency: "GEL", category: 'entertainment', comment: "some_comment" } }),
            left({ piece: "piece_that_failed_to_be_parsed" }),
        ];

        const exporter = new JSONExporter(true);
        const stream = exporter.export(scan);

        const expectedJSON = JSON.stringify([
            {
                operation: {
                    date: "2024-01-01T00:00:00.000Z",
                    value: 1,
                    currency: "GEL",
                    category: "entertainment",
                    comment: "some_comment"
                }
            },
            {
                operation: {
                    date: "2024-01-01T00:00:00.000Z",
                    value: 1,
                    currency: "GEL",
                    category: "entertainment",
                    comment: "some_comment"
                }
            },
            {
                operation: {
                    date: "2024-01-01T00:00:00.000Z",
                    value: 1,
                    currency: "GEL",
                    category: "entertainment",
                    comment: "some_comment"
                }
            },
            {
                operation: {
                    date: "2024-01-01T00:00:00.000Z",
                    value: 1,
                    currency: "GEL",
                    category: "entertainment",
                    comment: "some_comment"
                }
            },
            {
                piece: "piece_that_failed_to_be_parsed"
            }
        ], null, 4);

        const jsonParts: string[] = [];

        const reader = stream.getReader();
        while (true) {
            console.log('reading...')
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            const decoder = new TextDecoder();
            jsonParts.push(decoder.decode(value));
        }

        const actualJSON = jsonParts.join("");
        expect(JSON.parse(actualJSON)).toMatchObject(JSON.parse(expectedJSON));
    })
})