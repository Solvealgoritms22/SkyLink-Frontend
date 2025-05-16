export function toMidnight(date: string | Date): Date {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function rangeBetween(start: Date, end: Date): Date[] {
    const arr: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
        arr.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return arr;
}