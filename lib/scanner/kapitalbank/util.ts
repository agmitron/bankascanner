export function oneof(
	regexes: RegExp[],
	piece: string,
): RegExpExecArray | null {
	for (const re of regexes) {
		const match = re.exec(piece);
		if (match) {
			return match;
		}
	}

	return null;
}
