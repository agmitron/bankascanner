import fs from "fs/promises";
import yargs from "yargs";
import path from "path";
import { hideBin } from "yargs/helpers";
import * as kapitalbank from "~/import/kapitalbank";
import { JSONExporter } from "~/export/json";
import {
  DEFAULT_VERSION,
  UnknownVersionError,
  UnknownBankError,
  Version,
  Versioner,
} from "~/entities/import";

const versioners: Record<string, Versioner<Version<string>>> = {
  kapitalbank: new kapitalbank.Versioner(),
} as const;

const getVersioner = (bank: string) => {
  const versioner = versioners[bank];
  if (!versioner) {
    throw new UnknownBankError(bank);
  }

  return versioner;
}

const exporters = {
  json: new JSONExporter(),
} as const;

const argv = yargs(hideBin(process.argv))
  .options({
    in: { type: "string", demandOption: true },
    out: { type: "string", demandOption: true },
    bank: {
      type: "string",
      demandOption: true,
      choices: Object.keys(versioners),
    },
    version: { type: "string", alias: "v" },
  })
  .check((argv) => {
    const versioner = getVersioner(argv.bank);

    const version = argv.version || DEFAULT_VERSION;
    if (!versioner.supported.includes(version)) {
      throw new UnknownVersionError(version, argv.bank);
    }

    return true;
  })
  .parseSync();

async function main() {
  const versioner = getVersioner(argv.bank);

  const exportFormat = argv.out.split(".").pop();
  if (exportFormat !== "json") {
    throw new Error("Only JSON output is supported for now!");
  }

  const exporter = exporters[exportFormat as keyof typeof exporters];
  if (!exporter) {
    throw new Error("Unknown export format " + exportFormat);
  }

  const pdfFile = await fs.readFile(path.resolve(__dirname, argv.in));

  const v = argv.version || (await versioner.guess(pdfFile));
  const importer = versioner.choose(v);

  const rows = await importer.import(pdfFile);
  const buffer = await exporter.export(rows);

  await fs.writeFile(path.resolve(__dirname, argv.out), buffer);
}

main().catch(console.error);
