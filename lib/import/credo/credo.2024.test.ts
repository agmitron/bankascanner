import { assert, describe, expect } from "vitest";
import type { Row } from "~/row";
import { CredoV2024 } from "./credo.2024";

describe("Credo2024", async () => {
    const expected: Row[] = [];

    const actual = new CredoV2024().import(Buffer.from(""));

    expect(await actual).toEqual(expected);
})