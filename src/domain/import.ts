import type { Row } from "./row";

export class UnknownBankError extends Error {
  constructor(bank: string) {
    super(`Unknown bank ${bank}`);
  }
}

export class UnknownVersionError extends Error {
  constructor(version: string, bank: string) {
    super(`Unknown version ${version} for bank ${bank}`);
  }
}

export const DEFAULT_VERSION = "default";

export type Version<V extends string> = typeof DEFAULT_VERSION | V;

export interface Importer {
  import(file: Buffer): Promise<Row[]>;
}

/**
 * Versioner is responsible for guessing the version of the
 * statement and choosing the appropriate importer.
 */
export interface Versioner<V extends string> {
  /**
   * Tries to determine the version of the statement according to its contents.
   */
  guess(file: Buffer): Promise<Version<V>>;

  /**
   * Chooses the importer based on the version of the statement.
   */
  choose(v: Version<V>): Importer;

  /**
   * Returns the list of supported versions.
   */
  get supported(): Version<V>[];
}
