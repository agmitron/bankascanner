import path from "node:path";
import { test, describe, expect } from "vitest";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { readFileSync } from "node:fs";
import { Versioner } from ".";
import type { Statement } from "~/statement";

describe("Kapitalbank", () => {
	const versioner = new Versioner();

	describe("2024", () => {
		test("scan", async () => {
			const scanner = versioner.choose("2024");

			const expectedFirst10rows: Operation[] = [
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
	отправителя 8a26ede9-3b7b-46a3-b3dc- 770b7055b90b. 
	UID получателя 61808226. Номер ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.`,
					value: 100.0,
					date: ddmmyyyy("14.07.2024"),
					category: "other",
					currency: "USD",
				},
				{
					comment: `Перевод со счета на Visa в валюте. UID
	отправителя 8a26ede9-3b7b-46a3-b3dc- 770b7055b90b. 
	UID получателя 61808226. Номер ДБО KA-91e74d5d-0934-42c6-a180-9b8fb4c2114f.`,
					value: 300,
					date: ddmmyyyy("14.07.2024"),
					category: "other",
					currency: "USD",
				},
			];

			const expectedLast10rows: Operation[] = [
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

			const buffer = readFileSync(
				path.resolve(__dirname, "./__fixtures__/test.txt"),
			);

			const statement: Statement = {
				content: buffer.toString(),
			};

			const actual = scanner.scan(statement);

			const first10rows = Array.from(actual).slice(0, 10);
			const last10rows = Array.from(actual).slice(-10);

			expect(
				first10rows.map((r) => r.isRight() && r.value.operation.value),
			).toMatchObject(expectedFirst10rows.map((r) => r.value));

			expect(
				last10rows.map((r) => r.isRight() && r.value.operation.value),
			).toMatchObject(expectedLast10rows.map((r) => r.value));
		});
	});
});
