import * as _ from 'lodash';

export class Utils {
    static toMap<T, U>(items: T[], getKey: (item: T) => any = x => x['id'], getValue: (item: T) => U = x => <U><unknown>x) {
        return items?.reduce((agg, i) => agg.set(getKey(i), getValue(i)), new Map<string, U>()) ?? new Map<string, U>();
    }

    static assignToMap(map: Map<any, any>, id: string, value: any): void {
        if (map.has(id)) map.set(id, _.assign(map.get(id), value));
        else map.set(id, value);
    }
}
