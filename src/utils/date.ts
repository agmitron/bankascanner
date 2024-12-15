export const ddmmyyyy = (v: string, time: string = "00:00:00"): Date => {
    const [day, month, year] = v.split(".");
    return new Date(`${year}-${month}-${day} ${time}`);
}