import { describe, expect, test } from "vitest";
import type { Row } from "~/entities/row";
import { ddmmyyyy } from "~/date";
import { JusanV2024 } from "./jusan.2024";
import { readFile } from "node:fs/promises";
import path from "node:path";

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
`25.10.2024 IM IVAN KRUPENIKOV 28.10.2024ПокупкаGEO, BATUMI5.00GEL0.001.86`
        ];

        const actual = instance["_split"](given);

        expect(actual).toMatchObject(expected);
        expect(actual.length).toBe(expected.length);
    });

//     test("_extractInfo", () => {
//         const given = `23.11.2024
//   19:05
//   23.11.2024
//   19:06
//   +3 000.00 ₽+3 000.00 ₽Пополнение. Система
//   быстрых платежей
//   1734`;

//         const expected: Row = {
//             date: ddmmyyyy("23.11.2024", "19:06:00"),
//             value: +3000.0,
//             category: "other",
//             comment: "Пополнение. Система   быстрых платежей",
//             currency: "RUB",
//         };

//         const actual = instance["_extractInfo"](given);

//         expect(actual).toMatchObject(expected);
//     });

    // test("import", async () => {
    //     const expected10firstRows: Row[] = [
    //         {
    //             value: +3000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Пополнение. Система быстрых платежей",
    //             date: ddmmyyyy("23.11.2024", "19:06:00"),
    //         },
    //         {
    //             value: -99,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Плата за обслуживание",
    //             date: ddmmyyyy("18.11.2024", "23:42:00"),
    //         },
    //         {
    //             value: -15000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Внутренний перевод на договор 5397095018",
    //             date: ddmmyyyy("02.11.2024", "06:58:00"),
    //         },
    //         {
    //             value: +10000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Пополнение. Система быстрых платежей",
    //             date: ddmmyyyy("01.11.2024", "10:07:00"),
    //         },
    //         {
    //             value: +10000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Пополнение. Сбербанк Онлайн",
    //             date: ddmmyyyy("01.11.2024", "08:32:00"),
    //         },
    //         {
    //             value: +5000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Пополнение. Сбербанк Онлайн",
    //             date: ddmmyyyy("01.11.2024", "07:12:00"),
    //         },
    //         {
    //             value: -42000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Внешний перевод по номеру телефона +79138853138",
    //             date: ddmmyyyy("20.10.2024", "20:33:00"),
    //         },
    //         {
    //             value: +40000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Внутрибанковский перевод с договора 8152681174",
    //             date: ddmmyyyy("20.10.2024", "20:32:00"),
    //         },
    //         {
    //             value: -99,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Плата за обслуживание",
    //             date: ddmmyyyy("19.10.2024", "00:03:00"),
    //         },
    //         {
    //             value: -10000,
    //             currency: "RUB",
    //             category: "other",
    //             comment: "Внутренний перевод на договор 5859425828",
    //             date: ddmmyyyy("03.10.2024", "11:56:00"),
    //         },
    //     ];

    //     const pdf = await readFile(
    //         path.resolve(__dirname, "./__fixtures__/test.pdf"),
    //     );
    //     const rows = await instance.import(pdf);
    //     const actual10firstRows = rows.slice(0, 10);

    //     expect(actual10firstRows).toEqual(expected10firstRows);
    // });
});