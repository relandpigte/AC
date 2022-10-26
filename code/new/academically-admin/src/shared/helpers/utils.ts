export class Utils {
    static toMap<T, U>(items: T[], getKey: (item: T) => any = x => x['id'], getValue: (item: T) => U = x => <U><unknown>x) {
        return items?.reduce((agg, i) => agg.set(getKey(i), getValue(i)), new Map<string, U>()) ?? new Map<string, U>();
    }
}
