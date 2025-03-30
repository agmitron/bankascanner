import { describe, expect, test } from "vitest";
import type { Operation } from "~/operation";
import { ddmmyyyy } from "~/date";
import { TBCV2024 } from "./tbc.2024";
import path from "node:path";
import { readFileSync } from "node:fs";
import type { Statement } from "~/statement";

describe("TBC", () => {
	const instance = new TBCV2024();

	test("_split", () => {
		const given = `02/11/2024POS - Vip Pay*YANDEX.GO, 7.70 GEL, Nov 1 2024 8:41PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
7.70197.59
03/11/2024POS - Vip Pay*YANDEX.GO, 3.70 GEL, Nov 2 2024 5:57PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
3.70193.89
04/11/2024POS - Vip Pay*YANDEX.GO, 4.80 GEL, Nov 3 2024 2:05PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
4.80189.09
04/11/2024POS - Vip Pay*YANDEX.GO, 3.20 GEL, Nov 3 2024 2:24PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
3.20185.89
06/11/2024POS wallet - GLDANI & CO, 10.00 GEL, Nov 4 2024 9:54PM,
რესტორანი, კაფე, ბარი, MCC: 5812, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
10.00175.89
06/11/2024Private transfer within TBC
ალექსანდრე კაკაბაძე, TBCBGE22, 
GE00TB0000000000000000
98.8877.01
08/11/2024სატარიფო პაკეტის ძირითადი საკომისიო, 07/11/2024/
ყოველთვიური/ნაკრები10
დებიტორები - სატარიფო პაკეტის საკომისიო, TBCBGE22, 
GE00TB0000000000000000
10.0067.01
08/11/2024POS - LUKA NADIRADZE, 3.60 GEL, Nov 6 2024 12:21PM,
სასურსათო მაღაზიები, MCC: 5411, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
3.6063.41
08/11/2024POS - LUKA NADIRADZE, 5.25 GEL, Nov 6 2024 12:22PM,
სასურსათო მაღაზიები, MCC: 5411, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
5.2558.16
08/11/2024POS wallet - cork coffee, 20.00 GEL, Nov 6 2024 11:50AM,
რესტორანი, კაფე, ბარი, MCC: 5812, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
20.0038.16`;

		const expected = [
			`02/11/2024POS - Vip Pay*YANDEX.GO, 7.70 GEL, Nov 1 2024 8:41PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
7.70197.59`,
			`03/11/2024POS - Vip Pay*YANDEX.GO, 3.70 GEL, Nov 2 2024 5:57PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
3.70193.89`,
			`04/11/2024POS - Vip Pay*YANDEX.GO, 4.80 GEL, Nov 3 2024 2:05PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
4.80189.09`,
			`04/11/2024POS - Vip Pay*YANDEX.GO, 3.20 GEL, Nov 3 2024 2:24PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
3.20185.89`,
			`06/11/2024POS wallet - GLDANI & CO, 10.00 GEL, Nov 4 2024 9:54PM,
რესტორანი, კაფე, ბარი, MCC: 5812, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
10.00175.89`,
			`06/11/2024Private transfer within TBC
ალექსანდრე კაკაბაძე, TBCBGE22, 
GE00TB0000000000000000
98.8877.01`,
			`08/11/2024სატარიფო პაკეტის ძირითადი საკომისიო,`,
			`07/11/2024/
ყოველთვიური/ნაკრები10
დებიტორები - სატარიფო პაკეტის საკომისიო, TBCBGE22, 
GE00TB0000000000000000
10.0067.01`,
			`08/11/2024POS - LUKA NADIRADZE, 3.60 GEL, Nov 6 2024 12:21PM,
სასურსათო მაღაზიები, MCC: 5411, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
3.6063.41`,
			`08/11/2024POS - LUKA NADIRADZE, 5.25 GEL, Nov 6 2024 12:22PM,
სასურსათო მაღაზიები, MCC: 5411, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
5.2558.16`,
			`08/11/2024POS wallet - cork coffee, 20.00 GEL, Nov 6 2024 11:50AM,
რესტორანი, კაფე, ბარი, MCC: 5812, MC, 515881******0339
თიბისი ბანკის MC ბარათებით სავაჭრო ობიექტებში სხვა 
ბანკის ტერმინალებში, TBCBGE22, 
GE00TB0000000000000000
20.0038.16`,
		];

		const actual = instance["_split"](given);

		expect(actual).toMatchObject(expected);
		expect(actual.length).toBe(expected.length);
	});
	test("_determineCurrency", () => {
		const given = `Opening Balance396.55GEL`;
		const expected = `GEL`;
		const actual = instance["_determineCurrency"](given);
	});
	test("_extractInfo", () => {
		const given = `02/11/2024POS - Vip Pay*YANDEX.GO, 7.70 GEL, Nov 1 2024 8:41PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000
7.70197.59`;
		const previousBalance = 200;
		const expected: Operation = {
			date: ddmmyyyy("02.11.2024"),
			value: 7.7,
			category: "other",
			comment: `POS - Vip Pay*YANDEX.GO, 7.70 GEL, Nov 1 2024 8:41PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000`,
			currency: "GEL",
		};

		const actual = instance["_parsePiece"](given);

		expect(actual.isRight() && actual.value.operation).toMatchObject(expected);
	});
	test("import", async () => {
		const instance = new TBCV2024();
		const expected10firstRows: Operation[] = [
			{
				date: ddmmyyyy("2024-10-03"),
				value: 11.5,
				category: "other",
				comment: `POS - Vip Pay*YANDEX.GO, 11.50 GEL, Oct 2 2024 7:21PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-04"),
				value: -69.0,
				category: "other",
				comment: `Private transfer within TBC
ალექსანდრე კაკაბაძე, TBCBGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-06"),
				value: -5.2,
				category: "other",
				comment: `POS - Vip Pay*YANDEX.GO, 5.20 GEL, Oct 5 2024 3:24PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-06"),
				value: -4.7,
				category: "other",
				comment: `POS - Vip Pay*YANDEX.GO, 4.70 GEL, Oct 5 2024 3:47PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-09"),
				value: -271.0,
				category: "other",
				comment: `Currency Exchange (კროს-კურსი: 1 USD = 2.7100 GEL)
ალეკსეი გმიტრონ, TBCBGE22, GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-10"),
				value: -5.0,
				category: "other",
				comment: `Check
ANASTASIIA IVANOVA, BAGAGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-10"),
				value: -1.0,
				category: "other",
				comment: `საკომისიო გადარიცხვებზე სხვა ბანკებში (GEL)
საკომისიო შემოსავალი - ფიზიკური პირების გადარიცხვები, 
TBCBGE22, GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-10"),
				value: -65.0,
				category: "other",
				comment: `Check
ANASTASIIA IVANOVA, BAGAGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-10"),
				value: -1.0,
				category: "other",
				comment: `საკომისიო გადარიცხვებზე სხვა ბანკებში (GEL)
საკომისიო შემოსავალი - ფიზიკური პირების გადარიცხვები, 
TBCBGE22, GE00TB0000000000000000`,
				currency: "GEL",
			},
			{
				date: ddmmyyyy("2024-10-14"),
				value: -4.5,
				category: "other",
				comment: `POS - Vip Pay*YANDEX.GO, 4.50 GEL, Oct 13 2024 1:35PM,
ტრანსპორტი, MCC: 4121, MC, 515881******0339
TBCBank_ის MC ბარათებით TBC Bank_ის ECOM/POS 
მერჩანტებში შესრულებული, TBCBGE22, 
GE00TB0000000000000000`,
				currency: "GEL",
			},
		];

		const buffer = readFileSync(
			path.resolve(__dirname, "./__fixtures__/test.txt"),
		);

		const statement: Statement = {
			content: buffer.toString(),
		}

		const scan = instance.scan(statement);
		const actual10firstRows = Array.from(scan)
			.slice(0, 10)
			.map((r) => r.isRight() && r.value.operation);

		expect(actual10firstRows).toEqual(expected10firstRows);
	});
});
