import * as _ from 'lodash';

export class Utils {
    static toMap<T, U>(items: T[], getKey: (item: T) => any = x => x['id'], getValue: (item: T) => U = x => <U><unknown>x) {
        return items?.reduce((agg, i) => agg.set(getKey(i), getValue(i)), new Map<string, U>()) ?? new Map<string, U>();
    }

    static assignToMap(map: Map<any, any>, id: string, value: any, isSkipInsert = false): void {
        if (map.has(id)) map.set(id, _.assign(map.get(id), value));
        else if (!isSkipInsert) map.set(id, value);
    }

    static uuidv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          function (c) {
            // tslint:disable-next-line: no-bitwise
            const r = (Math.random() * 16) | 0,
              // tslint:disable-next-line: no-bitwise
              v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }

    static randomNonZero = (max, min = 1) => Math.floor(Math.random() * (max - min)) + min;
}
