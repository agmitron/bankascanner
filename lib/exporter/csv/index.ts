// TODO: to be implemented

import type { Exporter } from "../index";
import type { Scan } from "~/scanner";
import Papa from "papaparse";
import type { Operation } from "~/operation";

export class CSVExporter implements Exporter {
  readonly canFail = false;

  constructor(private readonly pretty = false) {}

  export(scan: Scan): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    
    return new ReadableStream({
      start(controller) {
        // Prepare all data at once
        const data = [];
        
        // Add header
        data.push(["date", "value", "category", "comment", "currency"]);
        
        // Add rows
        for (const attempt of scan) {
          if (attempt.isRight()) {
            const op: Operation = attempt.value.operation;
            data.push([
              op.date.toISOString().split('T')[0],
              op.value,
              op.category,
              op.comment,
              op.currency
            ]);
          }
        }
        
        // Convert to CSV
        const csv = Papa.unparse(data, {
          header: false,
          skipEmptyLines: true,
          newline: "\n"
        });
        
        controller.enqueue(encoder.encode(csv));
        controller.close();
      }
    });
  }
}

