export const ddmmyyyy = (date: string, time = "00:00:00"): Date => {
	const [day, month, year] = date.split(".");
	return new Date(`${year}-${month}-${day} ${time}`);
};
