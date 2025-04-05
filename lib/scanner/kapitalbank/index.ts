import { build, type Parser } from "~/scanner/builder";
import { left, right } from "~/either";
import { ddmmyyyy } from "~/date";
import { oneof } from "./util";

const v2024: () => Parser = () => {
	let currency: string | null = null;

	return {
		prepare(full) {
			const footer = `
			Head of the Retail OperationsLebedenko E.P.
			Single branch JSCB "Kapitalbank" 
			`.trim();

			const r = new RegExp(
				/(\w+\s\w+)\s+\n?Account number: (\d*)\s+\n?Account currency: (.*)/gm,
			);

			currency = r.exec(full)?.[3] || null;

			return full
				.replace(footer, "")
				.replace(
					/(\w+\s\w+)\s+\n?Account number: (\d*)\s+\n?Account currency: (.*)/gm,
					"",
				);
		},
		pieces(prepared) {
			const matches = prepared.match(
				/(\d{2}\.\d{2}\.\d{4}\d{2}\.\d{2}\.\d{4})(.\n?)*?(?=(\d{2}\.\d{2}\.\d{4}\d{2}\.\d{2}\.\d{4})|$)/gm,
			);

			if (!matches) {
				return [];
			}

			return matches.map((m) => m.trim());
		},
		operation(piece) {
			if (!currency) {
				return left({ piece });
			}

			// negative values less than 1_000 (with a minus sign)
			const re1 = /(\d{2}\.\d{2}\.\d{4})\d{2}\.\d{2}\.\d{4}.+(-\d+\.\d{2})/gm;

			// negative values greater than 1_000 (with a minus sign)
			const re2 =
				/(\d{2}\.\d{2}\.\d{4})\d{2}\.\d{2}\.\d{4}.+(-\d\s\d{3}\.\d{2})/gm;

			// positive values less than 1_000
			const re3 =
				/(\d{2}\.\d{2}\.\d{4})\d{2}\.\d{2}\.\d{4}.+(-?\d{3}\.\d{2})/gm;

			// positive values greater than 1_000
			const re4 =
				/(\d{2}\.\d{2}\.\d{4})\d{2}\.\d{2}\.\d{4}.+(\d\s\d{3}\.\d{2})/gm;

			const matches = oneof([re1, re2, re3, re4], piece);
			if (!matches) {
				return left({ piece });
			}

			const [_, _date, _value] = matches;
			const date = ddmmyyyy(_date);
			const value = Number.parseFloat(
				_value.replaceAll(" ", "").replace(",", "."),
			);

			const comment = piece.replaceAll(matches[0], "").trim();
			return right({
				operation: {
					category: "other", // TODO:
					comment,
					date,
					value,
					currency,
				},
			});
		},
	};
};

export const Versioner = build<"2024">("Kapitalbank", {
	"2024": v2024(),
	latest: v2024(),
});
