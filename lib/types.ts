// Реэкспорт всех типов из библиотеки для удобства импорта
export type { Statement } from './statement';
export type { Operation } from './operation';
export type { Either } from './either';
export type { UnknownBankError } from './bank';
export type { Category } from './category';

// Экспорт типов из scanner
export type { Version, Versioner } from './scanner/version';
export type { Scan, Scanner, Attempt, Success, Failure } from './scanner';