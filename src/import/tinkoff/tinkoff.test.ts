import { describe, expect, test } from "vitest";
import { Row } from "~/entities/row";
import { ddmmyyyy } from "~/utils/date";
import { Tinkoff } from "./tinkoff";
import { readFile } from "fs/promises";
import path from "path";

describe("Tinkoff", () => {
  const instance = new Tinkoff();

  test("parse", async () => {
    const expected10firstRows: Row[] = [
      {
        value: +3000,
        currency: "RUB",
        category: "other",
        comment: "Пополнение. Система быстрых платежей",
        date: ddmmyyyy("23.11.2024"),
      },
      {
        value: -99,
        currency: "RUB",
        category: "other",
        comment: "Плата за обслуживание",
        date: ddmmyyyy("18.11.2024"),
      },
      {
        value: -15000,
        currency: "RUB",
        category: "other",
        comment: "Внутренний перевод на договор 5397095018",
        date: ddmmyyyy("02.11.2024"),
      },
      {
        value: +10000,
        currency: "RUB",
        category: "other",
        comment: "Пополнение. Система быстрых платежей",
        date: ddmmyyyy("01.11.2024"),
      },
      {
        value: +10000,
        currency: "RUB",
        category: "other",
        comment: "Пополнение. Сбербанк Онлайн",
        date: ddmmyyyy("01.11.2024"),
      },
      {
        value: +5000,
        currency: "RUB",
        category: "other",
        comment: "Пополнение. Сбербанк Онлайн",
        date: ddmmyyyy("01.11.2024"),
      },
      {
        value: -42000,
        currency: "RUB",
        category: "other",
        comment: "Внешний перевод по номеру телефона +79138853138",
        date: ddmmyyyy("20.10.2024"),
      },
      {
        value: -99,
        currency: "RUB",
        category: "other",
        comment: "Внутрибанковский перевод с договора 8152681174",
        date: ddmmyyyy("20.10.2024"),
      },
      {
        value: -99,
        currency: "RUB",
        category: "other",
        comment: "Плата за обслуживание",
        date: ddmmyyyy("19.10.2024"),
      },
      {
        value: -10000,
        currency: "RUB",
        category: "other",
        comment: "Внутренний перевод на договор 5859425828",
        date: ddmmyyyy("18.11.2024"),
      },
    ];

    const pdf = await readFile(path.resolve(__dirname, "./__fixtures__/test.pdf"));
    const rows = await instance.import(pdf)
    const actual10firstRows = rows.slice(0, 10);

    expect(actual10firstRows).toEqual(expected10firstRows);
  });
});
