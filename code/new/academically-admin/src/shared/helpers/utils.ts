import * as _ from 'lodash';

export class Utils {
    static toMap<T, U>(items: T[], getKey: (item: T) => any = x => x['id'], getValue: (item: T) => U = x => <U><unknown>x) {
        return items?.reduce((agg, i) => agg.set(getKey(i), getValue(i)), new Map<string, U>()) ?? new Map<string, U>();
    }

    static toObjectMap<T, U>(items: T[], getKey: (item: T) => any = x => x['id'], getValue: (item: T) => U = x => <U><unknown>x): { [key: string]: U } {
      return items?.reduce((agg, i) => (agg[getKey(i)] = getValue(i), agg), {}) ?? {};
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

    static wheelController = (slider) => {
      let touchTimeout;
      let position;
      let wheelActive;

      function canExecuteOrientation(evt) {
        return Math.abs(evt.deltaX) > Math.abs(evt.deltaY);
      }

      function dispatch(e, name) {
        const direction = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        position.x -= e.deltaX;
        position.y -= e.deltaX;

        slider.container.dispatchEvent( new CustomEvent(name, { detail: { x: position.x, y: position.y } }) );
      }

      function wheelStart(e) {
        position = { x: e.pageX, y: e.pageY };
        dispatch(e, 'ksDragStart');
      }

      function wheel(e) {
        dispatch(e, 'ksDrag');
      }

      function wheelEnd(e) {
        dispatch(e, 'ksDragEnd');
      }

      function eventWheel(e) {
        if (!canExecuteOrientation(e)) return;
        e.preventDefault();
        if (!wheelActive) {
          wheelStart(e);
          wheelActive = true;
        }
        wheel(e);
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
          wheelActive = false;
          wheelEnd(e);
        }, 50);
      }

      slider.on('created', () => slider.container.addEventListener('wheel', eventWheel, { passive: false }));
    }

    static generateUrlParams(params?: Record<string, any>): string {
      return params ? Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent([].concat(params[key] as any).join(','))}`)
            .join('&') : null;
    }
}
