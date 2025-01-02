import type { Category } from "./category";

export interface Row {
	date: Date;
	value: number;
	category: Category;
	comment: string;
	currency: string;
}
