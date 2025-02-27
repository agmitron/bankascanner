import type { Category } from "./category";

export interface Operation {
	date: Date;
	value: number;
	category: Category;
	comment: string;
	currency: string;
}
