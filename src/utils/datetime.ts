export function getCurrentDateTime(): string {
    const date = new Date();
    return date.toLocaleString("mn-MN", {
        timeZone: "Asia/Ulaanbaatar",
        hour12: false,
    });
}
export function getCurrentDate(): string {
    const date = new Date();
    return date.toLocaleDateString("mn-MN", {
        timeZone: "Asia/Ulaanbaatar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}