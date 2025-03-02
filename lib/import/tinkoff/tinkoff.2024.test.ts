import { describe, expect, test } from "vitest";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { TinkoffV2024 } from "./tinkoff.2024";
import { readFile } from "node:fs/promises";
import path from "node:path";

describe("Tinkoff", () => {
	const instance = new TinkoffV2024();

	test("_split", () => {
		const given = `23.11.2024
    19:05
    23.11.2024
    19:06
    +3 000.00 ₽+3 000.00 ₽Пополнение. Система
    быстрых платежей
    1734
    18.11.2024
    23:42
    18.11.2024
    23:42
    -99.00 ₽-99.00 ₽Плата за обслуживание—
    02.11.2024
    06:58
    02.11.2024
    06:58
    -15 000.00 ₽-15 000.00 ₽Внутренний перевод на
    договор 5397095018
    1734
    01.11.2024
    10:07
    01.11.2024
    10:07
    +10 000.00 ₽+10 000.00 ₽Пополнение. Система
    быстрых платежей
    1734
    01.11.2024
    08:32
    01.11.2024
    08:32
    +10 000.00 ₽+10 000.00 ₽Пополнение. Сбербанк
    Онлайн`;

		const expected = [
			`23.11.2024
    19:05
    23.11.2024
    19:06
    +3 000.00 ₽+3 000.00 ₽Пополнение. Система
    быстрых платежей
    1734`,
			`18.11.2024
    23:42
    18.11.2024
    23:42
    -99.00 ₽-99.00 ₽Плата за обслуживание—`,
			`02.11.2024
    06:58
    02.11.2024
    06:58
    -15 000.00 ₽-15 000.00 ₽Внутренний перевод на
    договор 5397095018
    1734`,
			`01.11.2024
    10:07
    01.11.2024
    10:07
    +10 000.00 ₽+10 000.00 ₽Пополнение. Система
    быстрых платежей
    1734`,
			`01.11.2024
    08:32
    01.11.2024
    08:32
    +10 000.00 ₽+10 000.00 ₽Пополнение. Сбербанк
    Онлайн`,
		];

		const actual = instance["_split"](given);

		expect(actual).toMatchObject(expected);
		expect(actual.length).toBe(expected.length);
	});

	test("_extractInfo", () => {
		const given = `23.11.2024
  19:05
  23.11.2024
  19:06
  +3 000.00 ₽+3 000.00 ₽Пополнение. Система
  быстрых платежей
  1734`;

		const expected: Operation = {
			date: ddmmyyyy("23.11.2024", "19:06:00"),
			value: +3000.0,
			category: "other",
			comment: "Пополнение. Система   быстрых платежей",
			currency: "RUB",
		};

		const actual = instance["_parsePiece"](given);

		expect(actual.isRight() && actual.value.operation).toMatchObject(expected);
	});

	test("import", async () => {
		const expected10firstRows: Operation[] = [
			{
				value: +3000,
				currency: "RUB",
				category: "other",
				comment: "Пополнение. Система быстрых платежей",
				date: ddmmyyyy("23.11.2024", "19:06:00"),
			},
			{
				value: -99,
				currency: "RUB",
				category: "other",
				comment: "Плата за обслуживание",
				date: ddmmyyyy("18.11.2024", "23:42:00"),
			},
			{
				value: -15000,
				currency: "RUB",
				category: "other",
				comment: "Внутренний перевод на договор 5397095018",
				date: ddmmyyyy("02.11.2024", "06:58:00"),
			},
			{
				value: +10000,
				currency: "RUB",
				category: "other",
				comment: "Пополнение. Система быстрых платежей",
				date: ddmmyyyy("01.11.2024", "10:07:00"),
			},
			{
				value: +10000,
				currency: "RUB",
				category: "other",
				comment: "Пополнение. Сбербанк Онлайн",
				date: ddmmyyyy("01.11.2024", "08:32:00"),
			},
			{
				value: +5000,
				currency: "RUB",
				category: "other",
				comment: "Пополнение. Сбербанк Онлайн",
				date: ddmmyyyy("01.11.2024", "07:12:00"),
			},
			{
				value: -42000,
				currency: "RUB",
				category: "other",
				comment: "Внешний перевод по номеру телефона +79138853138",
				date: ddmmyyyy("20.10.2024", "20:33:00"),
			},
			{
				value: +40000,
				currency: "RUB",
				category: "other",
				comment: "Внутрибанковский перевод с договора 8152681174",
				date: ddmmyyyy("20.10.2024", "20:32:00"),
			},
			{
				value: -99,
				currency: "RUB",
				category: "other",
				comment: "Плата за обслуживание",
				date: ddmmyyyy("19.10.2024", "00:03:00"),
			},
			{
				value: -10000,
				currency: "RUB",
				category: "other",
				comment: "Внутренний перевод на договор 5859425828",
				date: ddmmyyyy("03.10.2024", "11:56:00"),
			},
		];

		const pdf = await readFile(
			path.resolve(__dirname, "./__fixtures__/test.pdf"),
		);

		const rows = await instance.import(pdf);
		const actual10firstRows = rows
			.slice(0, 10)
			.map((r) => r.isRight() && r.value.operation);

		expect(actual10firstRows).toEqual(expected10firstRows);
	});
});
