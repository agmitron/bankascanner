import pdf from "pdf-parse";
import path from "node:path";
import * as fs from "node:fs/promises";
import { test, describe, expect } from "vitest";
import { KapitalBank } from "./kapitalbank";
import type { Row } from "~/entities/row";
import { ddmmyyyy } from "~/utils/date";
import type { Category } from "~/entities/category";

describe("Kapitalbank", () => {
	const instance = new KapitalBank();

	test("_split", () => {
		const given = `
    04.09.202404.09.20243150788-52.96
Списание по опер в MTSVANE KONCXI SLIP No 
67046
04.09.202404.09.20243204565-1.89Списание по опер в BREAD BUN SLIP No 67351
04.09.202404.09.20243223211-8.10Списание по опер в LLC LU-DA-NI SLIP No 49708
04.09.202404.09.20243233581-1.62
Списание по опер в Vip Pay*Yandex Go SLIP No 
49957
04.09.202404.09.20243301808-10.00Списание по опер в GITHUB, INC. SLIP No 164
04.09.202404.09.20243312309-0.32
Списание по опер в Goodwill Batumi 3 SLIP No 
49556
04.09.202404.09.20243315703-0.87
Списание по опер в Goodwill Batumi 3 SLIP No 
49496
05.09.202405.09.20247981563-4.90
Списание по опер в I/E NUGZAR TSETSKHLADZE 
SLIP No 15802
05.09.202405.09.202490239093 777.00
Перевод со счета на Visa в валюте. UID 
отправителя 8034a741-aa91-4199-9a52-
75ed8909fc6f. UID получателя 67904761. Номер 
ДБО KA-88bda216-f645-4e3a-89cb-2ac6746b0641.
06.09.202406.09.202410631850-1.00Списание по опер в VISA DIRECT SLIP No 0000376
06.09.202406.09.202410631853-2.00
Удержание комиссии за операцию. Slip 
No0000376
06.09.202406.09.202410640737-8.40Списание по опер в NIKORA 293 SLIP No 30900
06.09.202406.09.202410656264-3.59Списание по опер в DONA SLIP No 34632
06.09.202406.09.202410682994-1.81Списание по опер в LIBRE 607 SLIP No 30982
06.09.202406.09.202410691312-153.86Списание по опер в Esign.ardi.ge SLIP No 31037
06.09.202406.09.202412287108-3 759.48Списание по опер в VISA DIRECT SLIP No 0000124
23.09.202406.09.202412287114-37.59
Удержание комиссии за операцию. Slip 
No0000124

09.09.202409.09.202417987552-1.77Списание по опер в NIKORA 293 SLIP No 30237
09.09.202409.09.202418001398-8.21
Списание по опер в p/e nugzar tsetskhladze SLIP 
No 30412
09.09.202409.09.202418019952-3.00Списание по опер в LIBRE 607 SLIP No 30577
09.09.202409.09.202418132283-4.94Списание по опер в LIBRE 607 SLIP No 30576
    `;

		const expected = [
			`04.09.202404.09.20243150788-52.96
Списание по опер в MTSVANE KONCXI SLIP No 
67046`,
			`04.09.202404.09.20243204565-1.89Списание по опер в BREAD BUN SLIP No 67351`,
			`04.09.202404.09.20243223211-8.10Списание по опер в LLC LU-DA-NI SLIP No 49708`,
			`04.09.202404.09.20243233581-1.62
Списание по опер в Vip Pay*Yandex Go SLIP No 
49957`,
			`04.09.202404.09.20243301808-10.00Списание по опер в GITHUB, INC. SLIP No 164`,
			`04.09.202404.09.20243312309-0.32
Списание по опер в Goodwill Batumi 3 SLIP No 
49556`,
			`04.09.202404.09.20243315703-0.87
Списание по опер в Goodwill Batumi 3 SLIP No 
49496`,
			`05.09.202405.09.20247981563-4.90
Списание по опер в I/E NUGZAR TSETSKHLADZE 
SLIP No 15802`,
			`05.09.202405.09.202490239093 777.00
Перевод со счета на Visa в валюте. UID 
отправителя 8034a741-aa91-4199-9a52-
75ed8909fc6f. UID получателя 67904761. Номер 
ДБО KA-88bda216-f645-4e3a-89cb-2ac6746b0641.`,
			"06.09.202406.09.202410631850-1.00Списание по опер в VISA DIRECT SLIP No 0000376",
			`06.09.202406.09.202410631853-2.00
Удержание комиссии за операцию. Slip 
No0000376`,
			"06.09.202406.09.202410640737-8.40Списание по опер в NIKORA 293 SLIP No 30900",
			"06.09.202406.09.202410656264-3.59Списание по опер в DONA SLIP No 34632",
			"06.09.202406.09.202410682994-1.81Списание по опер в LIBRE 607 SLIP No 30982",
			"06.09.202406.09.202410691312-153.86Списание по опер в Esign.ardi.ge SLIP No 31037",
			"06.09.202406.09.202412287108-3 759.48Списание по опер в VISA DIRECT SLIP No 0000124",
			`23.09.202406.09.202412287114-37.59
Удержание комиссии за операцию. Slip 
No0000124`,
			"09.09.202409.09.202417987552-1.77Списание по опер в NIKORA 293 SLIP No 30237",
			`09.09.202409.09.202418001398-8.21
Списание по опер в p/e nugzar tsetskhladze SLIP 
No 30412`,
			"09.09.202409.09.202418019952-3.00Списание по опер в LIBRE 607 SLIP No 30577",
			"09.09.202409.09.202418132283-4.94Списание по опер в LIBRE 607 SLIP No 30576",
		];

		const actual = instance["_split"](given);

		expect(actual).toMatchObject(expected);
	});

	describe("_prepare", () => {
		test("should remove bank info and the info lines", () => {
			const given = `

 
Registration number     264306  
20.11.2024
 
 
STATEMENT  
for the period: 15.07.2024 to 20.11.2024
 
      * In accordance with the rules of payment systems, card payments are reflected in the account after clearing. This 
account statement may not contain some transactions made on the card, since they were not cleared by the time the 
card was drawn up. Account data may be reflected on other dates than they were made on the card (account data is 
reflected on the date of clearing, and not authorization of transactions on the card)
Posting 
date
Document 
date
Document 
Number
Transaction amountDetails
31.07.202401.07.20241619610-11.54
Списание по опер в TOO "TAMERLAN BI" SLIP No 
33207
31.07.202401.07.20241634996-3.65
Списание по опер в TOO "TAMERLAN BI" SLIP No 
32620
31.07.202411.07.202424196250-1.75Списание по опер в OOO COFFE SLIP No 35363
31.07.202411.07.202424198804-1.91Списание по опер в Yandex Go SLIP No 7643
31.07.202411.07.202424231840-2.50Списание по опер в Yandex Go SLIP No 6716
31.07.202411.07.202424276795-1.31Списание по опер в Yandex Go SLIP No 7497
13.07.202413.07.202429001374-100.00
Покупка валюты с ПК Visa на сумовую ПК Visa. 
UID отправителя 61804312. UID получателя 
61804313. Номер ДБО 4474dcaf-8420-4a92-ac68-
90b0904b826d
Joint Stock Commercial Bank “Kapitalbank”.  
Address: Uzbekistan, 100047, city of Tashkent, Sayilgokh, 7  
+998(71)200-15-15, info@kapitalbank.uz.  
Bank code MFO: 01088.  
SWIFT: KACHUZ22.`;

			const expected = `31.07.202401.07.20241619610-11.54
Списание по опер в TOO "TAMERLAN BI" SLIP No 
33207
31.07.202401.07.20241634996-3.65
Списание по опер в TOO "TAMERLAN BI" SLIP No 
32620
31.07.202411.07.202424196250-1.75Списание по опер в OOO COFFE SLIP No 35363
31.07.202411.07.202424198804-1.91Списание по опер в Yandex Go SLIP No 7643
31.07.202411.07.202424231840-2.50Списание по опер в Yandex Go SLIP No 6716
31.07.202411.07.202424276795-1.31Списание по опер в Yandex Go SLIP No 7497
13.07.202413.07.202429001374-100.00
Покупка валюты с ПК Visa на сумовую ПК Visa. 
UID отправителя 61804312. UID получателя 
61804313. Номер ДБО 4474dcaf-8420-4a92-ac68-
90b0904b826d
`;

			const actual = instance["_prepare"](given);

			expect(actual.trim()).eq(expected.trim());
		});
	});

	test("_extractProfile", () => {
		interface TestCase {
			given: string;
			expected: {
				name: string;
				account: string;
				currency: string;
			};
		}

		const tt: TestCase[] = [
			{
				given: `NAME LASTNAME  
Account number: 11111111111111111111  
Account currency: USD`,
				expected: {
					name: "NAME LASTNAME",
					account: "11111111111111111111",
					currency: "USD",
				},
			},
			{
				given: `NIKITA NIKITICH  
Account number: 11111111111111111111  
Account currency: UZS`,
				expected: {
					name: "NIKITA NIKITICH",
					account: "11111111111111111111",
					currency: "UZS",
				},
			},
			{
				given: `NIKITA NIKITICH  
Account number: 11111111111111111111  
Account currency: EUR`,
				expected: {
					name: "NIKITA NIKITICH",
					account: "11111111111111111111",
					currency: "EUR",
				},
			},
		];

		for (const tc of tt) {
			instance["_extractProfile"](tc.given);

			const actual = instance["_profile"];
			expect(actual).deep.eq(tc.expected);
		}
	});

	describe("_getDate", () => {
		interface TestCase {
			given: string;
			expected: Date;
		}

		const tt: TestCase[] = [
			{
				given: `23.09.202406.09.202412287114-37.59
Удержание комиссии за операцию. Slip 
No0000124`,
				expected: ddmmyyyy("06.09.2024"),
			},
		];

		for (const tc of tt) {
			test(tc.expected.toDateString(), () => {
				const actual = instance["_getDate"](tc.given);
				expect(actual.toLocaleDateString()).eq(
					tc.expected.toLocaleDateString(),
				);
			});
		}
	});

	describe("_getCategory", () => {
		interface TestCase {
			given: string;
			expected: Category;
		}

		const tt: TestCase[] = [
			{
				given: `14.07.202414.07.202429156037100.00
Перевод со счета на Visa в валюте. UID 
отправителя 8a26ede9-3b7b-46a3-b3dc-
770b7055b90b. UID получателя 61808226. Номер 
ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.
14.07.202414.07.202429845333300.00`,
				expected: "other",
			},
			{
				given: `15.07.202415.07.202432612667-2.27Списание по опер в Yandex Go SLIP No 19085`,
				expected: "other",
			},
			{
				given: `15.07.202415.07.202432715457-0.89
Списание по опер в MIROBOD FILIALI SLIP No 
51499`,
				expected: "other",
			},
			{
				given: `13.07.202414.07.202429030204-100.00
Покупка валюты с ПК Visa на сумовую ПК Visa. 
UID отправителя 61805973. UID получателя 
61805974. Номер ДБО 73f99d15-b751-4a53-b215-
e68e7f5f21c7`,
				expected: "other",
			},
		];

		for (const tc of tt) {
			test(tc.expected, () => {
				const actual = instance["_getCategory"](tc.given);
				expect(actual).eq(tc.expected);
			});
		}
	});

	describe("_getValue", () => {
		interface TestCase {
			given: string;
			expected: number;
		}

		const tt: TestCase[] = [
			{
				given: `14.07.202414.07.202429845333300.00
Перевод со счета на Visa в валюте. UID 
отправителя 3c7cd7a2-366b-4084-b374-
538aab9cb696. UID получателя 61819578. Номер 
ДБО KA-c173c6be-42ed-4809-ae9c-8e8630a3ab04.`,
				expected: 300,
			},
			{
				given:
					"15.07.202415.07.202432730567-1.23Списание по опер в Yandex Go SLIP No 19973",
				expected: -1.23,
			},
			{
				given: "15.07.202415.07.202413835073-455.00AAAAAAA",
				expected: -455.0,
			},
			{
				given: "15.07.202415.07.2024168497507 500.00AAAAAA",
				expected: 7500.0,
			},
			{
				given: "15.07.202415.07.2024L1654 589.00Anything lalalaa",
				expected: 4589.0,
			},
			{
				given:
					"15.07.202415.07.20241575037-7.08Списание по опер в RICH SHOP SLIP No 60067",
				expected: -7.08,
			},
		];

		for (const tc of tt) {
			test(`${tc.given} -> ${tc.expected}`, () => {
				const actual = instance["_getValue"](tc.given);
				expect(actual).eq(tc.expected);
			});
		}
	});

	describe("_getComment", () => {
		interface TestCase {
			given: string;
			expected: string;
		}

		const tt: TestCase[] = [
			{
				given: `14.07.202414.07.202429156037100.00
Перевод со счета на Visa в валюте. UID 
отправителя 8a26ede9-3b7b-46a3-b3dc-
770b7055b90b. UID получателя 61808226. Номер 
ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.`,
				expected: `Перевод со счета на Visa в валюте. UID 
отправителя 8a26ede9-3b7b-46a3-b3dc-
770b7055b90b. UID получателя 61808226. Номер 
ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.`,
			},
			{
				given: `14.07.202414.07.202429845333300.00
Перевод со счета на Visa в валюте. UID 
отправителя 3c7cd7a2-366b-4084-b374-
538aab9cb696. UID получателя 61819578. Номер 
ДБО KA-c173c6be-42ed-4809-ae9c-8e8630a3ab04.`,
				expected: `Перевод со счета на Visa в валюте. UID 
отправителя 3c7cd7a2-366b-4084-b374-
538aab9cb696. UID получателя 61819578. Номер 
ДБО KA-c173c6be-42ed-4809-ae9c-8e8630a3ab04.`,
			},
		];

		for (const tc of tt) {
			test(tc.expected, () => {
				const actual = instance["_getComment"](tc.given);
				expect(actual).eq(tc.expected);
			});
		}
	});

	test("parse", async () => {
		const data = await fs.readFile(
			path.resolve(__dirname, "./__fixtures__/test.pdf"),
		);

		const expectedFirst10rows: Row[] = [
			{
				comment: `Списание по опер в TOO "TAMERLAN BI" SLIP No 33207`,
				value: -11.54,
				date: ddmmyyyy("01.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Списание по опер в TOO "TAMERLAN BI" SLIP No 32620`,
				value: -3.65,
				date: ddmmyyyy("01.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Списание по опер в OOO COFFE SLIP No 35363`,
				value: -1.75,
				date: ddmmyyyy("11.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Списание по опер в Yandex Go SLIP No 7643`,
				value: -1.91,
				date: ddmmyyyy("11.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Списание по опер в Yandex Go SLIP No 6716`,
				value: -2.5,
				date: ddmmyyyy("11.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Списание по опер в Yandex Go SLIP No 7497`,
				value: -1.31,
				date: ddmmyyyy("11.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Покупка валюты с ПК Visa на сумовую ПК Visa. UID отправителя 61804312. UID получателя 61804313. Номер ДБО 4474dcaf-8420-4a92-ac68- 90b0904b826d`,
				value: -100.0,
				date: ddmmyyyy("13.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment:
					"Покупка валюты с ПК Visa на сумовую ПК Visa. UID отправителя 61805973. UID получателя 61805974. Номер ДБО 73f99d15-b751-4a53-b215- e68e7f5f21c7",
				value: -100.0,
				date: ddmmyyyy("14.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Перевод со счета на Visa в валюте. UID
отправителя 8a26ede9-3b7b-46a3-b3dc- 770b7055b90b. UID получателя 61808226. Номер ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.`,
				value: 100.0,
				date: ddmmyyyy("14.07.2024"),
				category: "other",
				currency: "USD",
			},
			{
				comment: `Перевод со счета на Visa в валюте. UID
отправителя 8a26ede9-3b7b-46a3-b3dc- 770b7055b90b. UID получателя 61808226. Номер ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.`,
				value: 300,
				date: ddmmyyyy("14.07.2024"),
				category: "other",
				currency: "USD",
			},
		];

		const expectedLast10rows: Row[] = [
			{
				comment: `Списание по опер в NIKORA 293 SLIP No 30900`,
				date: ddmmyyyy("06.09.2024"),
				category: "other",
				value: -8.4,
				currency: "USD",
			},
			{
				comment: `Списание по опер в DONA SLIP No 34632`,
				date: ddmmyyyy("06.09.2024"),
				category: "other",
				value: -3.59,
				currency: "USD",
			},
			{
				comment: `Списание по опер в LIBRE 607 SLIP No 30982`,
				date: ddmmyyyy("06.09.2024"),
				category: "other",
				value: -1.81,
				currency: "USD",
			},
			{
				comment: `Списание по опер в Esign.ardi.ge SLIP No 31037`,
				date: ddmmyyyy("06.09.2024"),
				category: "other",
				value: -153.86,
				currency: "USD",
			},
			{
				comment: `Списание по опер в VISA DIRECT SLIP No 0000124`,
				date: ddmmyyyy("06.09.2024"),
				category: "other",
				value: -3759.48,
				currency: "USD",
			},
			{
				comment: `Удержание комиссии за операцию. Slip No0000124`,
				date: ddmmyyyy("23.09.2024"),
				category: "other",
				value: -37.59,
				currency: "USD",
			},
			{
				comment: `Списание по опер в NIKORA 293 SLIP No 30237`,
				date: ddmmyyyy("09.09.2024"),
				category: "other",
				value: -1.77,
				currency: "USD",
			},
			{
				comment: `Списание по опер в p/e nugzar tsetskhladze SLIP No 30412`,
				date: ddmmyyyy("09.09.2024"),
				category: "other",
				value: -8.21,
				currency: "USD",
			},
			{
				comment: `Списание по опер в LIBRE 607 SLIP No 30577`,
				date: ddmmyyyy("09.09.2024"),
				category: "other",
				value: -3,
				currency: "USD",
			},
			{
				comment: `Списание по опер в LIBRE 607 SLIP No 30576`,
				date: ddmmyyyy("09.09.2024"),
				category: "other",
				value: -4.94,
				currency: "USD",
			},
		];

		const actual = await instance.import(data);

		const first10rows = actual.slice(0, 10);
		const last10rows = actual.slice(-10);

		expect(first10rows.map((r) => r.value)).toMatchObject(
			expectedFirst10rows.map((r) => r.value),
		);

		expect(last10rows.map((r) => r.value)).toMatchObject(
			expectedLast10rows.map((r) => r.value),
		);
	});
});
