export type CategoryPredicate = (s: string) => boolean;
export type CategoryDetectors = Map<Category, CategoryPredicate[]>;

export type Category = "food" | "transport" | "entertainment" | "other";
export type DefaultCategory = Extract<Category, "other">;
export const DEFAULT_CATEGORY: DefaultCategory = "other";

export const detectCategory = (
	detectorsMap: CategoryDetectors,
	input: string,
): Category => {
	for (const [category, detectors] of detectorsMap.entries()) {
		for (const detector of detectors) {
			const result = detector(input);
			if (result) {
				return category;
			}
		}
	}

	return DEFAULT_CATEGORY;
};
