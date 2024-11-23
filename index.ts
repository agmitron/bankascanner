import fs from "fs/promises";
import yargs from "yargs";
import path from "path";
import { hideBin } from "yargs/helpers";
import { KapitalBank } from "~/import/kapitalbank/kapitalbank";
import { Tinkoff } from "~/import/tinkoff/tinkoff";
import { JSONExporter } from "~/export/json";

const importers = {
  kapitalbank: new KapitalBank(),
  tinkoff: new Tinkoff(),
} as const;

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
      choices: Object.keys(importers),
    },
  })
  .parseSync();

async function main() {
  const importer = importers[argv.bank as keyof typeof importers];
  if (!importer) {
    throw new Error("Unknown bank " + argv.bank);
  }

  const exportFormat = argv.out.split(".").pop();
  if (exportFormat !== "json") {
    throw new Error("Only JSON output is supported for now!");
  }

  const exporter = exporters[exportFormat as keyof typeof exporters];
  if (!exporter) {
    throw new Error("Unknown export format " + exportFormat);
  }

  const pdfFile = await fs.readFile(path.resolve(__dirname, argv.in));

  const rows = await importer.import(pdfFile);
  const buffer = await exporter.export(rows);

  await fs.writeFile(path.resolve(__dirname, argv.out), buffer);
}

main().catch(console.error);
