import { describe, expect, test } from "vitest";
import { ddmmyyyy } from "./date";

describe("parses date in dd.mm.yyyy format", () => {
	test("parses 01.07.2024", () => {
		const date = ddmmyyyy("01.07.2024");
		expect(date).toEqual(new Date("2024-07-01 00:00:00"));
	});

	test("parses 31.07.2024", () => {
		const date = ddmmyyyy("31.07.2024");
		expect(date).toEqual(new Date("2024-07-31 00:00:00"));
	});
});
