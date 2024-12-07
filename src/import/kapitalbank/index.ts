import type { Versioner as IVersioner, Version } from "~/domain/import";
import { KapitalBankV2024 } from "./kapitalbank.2024";

type KapitalbankVersion = "2024"; // add more versions here if needed

const versions: Version<KapitalbankVersion>[] = ["default", "2024"];

export class Versioner implements IVersioner<KapitalbankVersion> {
  public get supported() {
    return versions;
  }

  public async guess(_: Buffer): Promise<Version<KapitalbankVersion>> {
    return "default";
  }

  public choose(v: Version<KapitalbankVersion>) {
    switch (v) {
      case "default":
      case "2024":
        return new KapitalBankV2024();
      default:
        throw new Error(`Unknown version: ${v}`);
    }
  }
}
