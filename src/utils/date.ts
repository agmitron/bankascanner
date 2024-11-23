export const ddmmyyyy = (v: string): Date => {
    const [day, month, year] = v.split(".");
    return new Date(`${year}-${month}-${day} 00:00:00`);
}