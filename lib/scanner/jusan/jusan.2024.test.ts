import { describe, expect, test } from "vitest";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { JusanV2024 } from "./jusan.2024";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { PDFImporter } from "~/importer/pdf";
import { FileReader } from "~/importer/reader";

describe("Jusan", () => {
	const instance = new JusanV2024();

	test("_split", () => {
		const given = `31.10.202429.10.2024 
10:59:46
ПокупкаALALI 2008 LTD 
Референс: 430306655362 
Код авторизации: 568318
GEO, Batumi25.00GEL0.009.27
30.10.202428.10.2024 
20:07:52
ПокупкаKIZIKI-2006 LTD 
Референс: 430216095064 
Код авторизации: 568317
GEO, Batumi28.80GEL0.0010.64
30.10.202428.10.2024 
20:04:09
Покупкаmagti.com 
Референс: 430216076790 
Код авторизации: 568316
GEO, Tbilisi60.00GEL0.0022.17
30.10.202428.10.2024 
10:59:32
ПокупкаNIKORA #745 
Референс: 430206188573 
Код авторизации: 568315
GEO, Batumi15.82GEL0.005.85
29.10.202427.10.2024 
17:22:55
ПокупкаLIBRE 607 
Референс: 430113777963 
Код авторизации: 568313
GEO, Batumi26.19GEL0.009.68
28.10.202427.10.2024 
16:56:20
Покупкаi.m Dmitrii Novikov
Референс: 430112623564 
Код авторизации: 568312
GEO, Batumi14.00GEL0.005.17
28.10.202427.10.2024 
16:02:36
ПокупкаTEMU.COM 
Код авторизации: 568314
IRL, DUBLIN 232.36GEL0.0011.96
28.10.202427.10.2024 
13:24:41
ПокупкаLLC DIGITAL DISTRIBUTI 
Референс: 430113696031 
Код авторизации: 568311
GEO, TBILISI164.80GEL0.0060.89
28.10.202426.10.2024 
19:46:59
ПокупкаCARREFOUR 
Референс: 430015509790 
Код авторизации: 568310
GEO, BATUMI10.20GEL0.003.77
25.10.2024 IM IVAN KRUPENIKOV 28.10.2024ПокупкаGEO, BATUMI5.00GEL0.001.86`;

		const expected = [
			`29.10.2024 
10:59:46
ПокупкаALALI 2008 LTD 
Референс: 430306655362 
Код авторизации: 568318
GEO, Batumi25.00GEL0.009.27`,
			`28.10.2024 
20:07:52
ПокупкаKIZIKI-2006 LTD 
Референс: 430216095064 
Код авторизации: 568317
GEO, Batumi28.80GEL0.0010.64`,
			`28.10.2024 
20:04:09
Покупкаmagti.com 
Референс: 430216076790 
Код авторизации: 568316
GEO, Tbilisi60.00GEL0.0022.17`,
			`28.10.2024 
10:59:32
ПокупкаNIKORA #745 
Референс: 430206188573 
Код авторизации: 568315
GEO, Batumi15.82GEL0.005.85`,
			`27.10.2024 
17:22:55
ПокупкаLIBRE 607 
Референс: 430113777963 
Код авторизации: 568313
GEO, Batumi26.19GEL0.009.68`,
			`27.10.2024 
16:56:20
Покупкаi.m Dmitrii Novikov
Референс: 430112623564 
Код авторизации: 568312
GEO, Batumi14.00GEL0.005.17`,
			`27.10.2024 
16:02:36
ПокупкаTEMU.COM 
Код авторизации: 568314
IRL, DUBLIN 232.36GEL0.0011.96`,
			`27.10.2024 
13:24:41
ПокупкаLLC DIGITAL DISTRIBUTI 
Референс: 430113696031 
Код авторизации: 568311
GEO, TBILISI164.80GEL0.0060.89`,
			`26.10.2024 
19:46:59
ПокупкаCARREFOUR 
Референс: 430015509790 
Код авторизации: 568310
GEO, BATUMI10.20GEL0.003.77`,
			`25.10.2024 IM IVAN KRUPENIKOV 28.10.2024ПокупкаGEO, BATUMI5.00GEL0.001.86`,
		];

		const actual = instance["_split"](given);

		expect(actual).toMatchObject(expected);
		expect(actual.length).toBe(expected.length);
	});
	test("_extractInfo", () => {
		const given = `29.10.2024 
10:59:46
ПокупкаALALI 2008 LTD 
Референс: 430306655362 
Код авторизации: 568318
GEO, Batumi25.00GEL0.009.27`;

		const expected: Operation = {
			date: ddmmyyyy("29.10.2024", "10:59:46"),
			value: -25.0,
			category: "other",
			comment: `ПокупкаALALI 2008 LTD
Референс: 430306655362
Код авторизации: 568318
GEO, Batumi`,
			currency: "GEL",
		};

		const actual = instance["_parsePiece"](given);

		expect(actual.isRight() && actual.value.operation).toMatchObject(expected);
	});
	test("import", async () => {
		const expected10firstRows: Operation[] = [
			{
				date: ddmmyyyy("2024-11-04", "11:22:56"),
				value: -113.98,
				category: "other",
				comment: `Покупка   Carrefour(BTM)
Референс: 430941151128
Код авторизации: 568326
GEO, Batumi`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("26.08.2024", "11:37:50"),
				value: -9000.0,
				category: "other",
				comment: `Перевод (со 
счета)
MOBILE BANK
Референс: 423901795442
Код авторизации: 568102
KAZ, 
ALMATY`,
				currency: "KZT",
			},
			{
				date: ddmmyyyy("26.08.2024", "11:37:31"),
				value: -9000.0,
				category: "other",
				comment: `Перевод
Перевод собственных средств на текущий счет 
KZ11111PB11111111111 по курсу 482.90 KZT за 
1 USD 
Референс: zb1enV6Ba0zb`,
				currency: "KZT",
			},
			{
				date: ddmmyyyy("02.11.2024", "15:04:09"),
				value: -17.5,
				category: "other",
				comment: `ПокупкаDONA 2005 LLC
Референс: 430711024304
Код авторизации: 568325
GEO, Batumi`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("02.11.2024", "10:59:05"),
				value: -420.0,
				category: "other",
				comment: `ПокупкаViktoria spa ltd
Референс: 430706720026
Код авторизации: 568324
GEO, Batumi`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("04.11.2024", "11:22:56"),
				value: -113.98,
				category: "other",
				comment: `ПокупкаCarrefour(BTM)
Референс: 430941151128
Код авторизации: 568326
GEO, Batumi`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("04.11.2024", "11:22:56"),
				value: -113.98,
				category: "other",
				comment: `ПокупкаCarrefour(BTM)
Референс: 430941151128
Код авторизации: 568326
GEO, Batumi`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("04.11.2024", "11:22:56"),
				value: -113.98,
				category: "other",
				comment: `ПокупкаCarrefour(BTM)
Референс: 430941151128
Код авторизации: 568326
GEO, Batumi`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("08.11.2024", "20:11:59"),
				value: -6.0,
				category: "other",
				comment: `Покупка33 VENDING
Референс: 431316674679
Код авторизации: 568327
GEO, TBILISI`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("08.11.2024", "20:11:59"),
				value: -6.0,
				category: "other",
				comment: `Покупка33 VENDING
Референс: 431316674679
Код авторизации: 568327
GEO, TBILISI`,
				currency: "GEL",
			},
		];

		const stream = createReadStream(
			path.resolve(__dirname, "./__fixtures__/test.pdf"),
		);

		const statement = await new PDFImporter().import(new FileReader(Readable.toWeb(stream)));

		const scan = await instance.scan(statement);

		const actual10firstRows = Array.from(scan).slice(0, 10);

		expect(actual10firstRows.every((r) => r.isRight())).toBe(true);
		expect(
			actual10firstRows.map((r) => r.isRight() && r.value.operation),
		).toEqual(expected10firstRows);
	});
});
