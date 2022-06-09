export class DateTimeHelper {
    static convertToHhMmStr(date: Date): string {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    static convertFromHhMmStr(date: string): Date {
        const converted = new Date();
        converted.setHours(+date.split(':')[0]);
        converted.setMinutes(+date.split(':')[1]);
        return converted
    }
}
