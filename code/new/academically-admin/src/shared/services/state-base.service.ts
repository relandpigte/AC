import { Subject, Subscription } from 'rxjs';
import { NotificationName } from './pub-sub.service';

export interface EventNotification {
    name: NotificationName;
    key: string;
}

export interface StateUpdate<T> {
    data: T;
    type: StateUpdateType;
}

export enum StateUpdateType {
    Add = 'add',
    Update = 'update',
    Delete = 'delete'
}

export abstract class StateServiceBase {
    private subscriptions: Subscription[] = [];
    private eventFn = (event) => this.eventNotification$.next({
        name: event.notification.notificationName,
        key: event.notification.data.properties.PostId
    });

    eventNotification$ = new Subject<EventNotification>();

    abstract loadData(component: any, userId: number): Promise<void>;
    protected abstract setupSubscriptions(component: any, userId: number): Promise<Subscription | Subscription[]>;

    async start(component: any, userId: number): Promise<void> {
        await this.startSubscriptions(component, userId);
        await this.loadData(component, userId);
    }

    async stop(): Promise<void> {
        await this.stopSubscriptions();
    }

    async startSubscriptions(component: any, userId: number): Promise<void> {
        await this.stopSubscriptions();
        abp.event.on('abp.notifications.received', this.eventFn);
        this.subscriptions = [].concat(await this.setupSubscriptions(component, userId)).filter(s => s);
    }

    async stopSubscriptions(): Promise<void> {
        abp.event.off('abp.notifications.received', this.eventFn);
        this.subscriptions?.forEach(s => s.unsubscribe());
        this.subscriptions = [];
    }

    protected updateFromMap<T extends U, U>(existingMap: Map<string, T>, updateMap: { [key: string]: U }, updateSub$: any) {
        const updateKeys = Object.keys(updateMap);
        updateKeys.forEach(k => {
            if (updateMap[k]) {
                const type = existingMap.has(k) ? StateUpdateType.Update : StateUpdateType.Add;
                existingMap.set(k, { ...existingMap.get(k), ...updateMap[k] } as T);
                this.sendUpdateEvent(updateSub$, existingMap.get(k), type);
            } else {
                const item = existingMap.get(k);
                existingMap.delete(k);
                this.sendUpdateEvent(updateSub$, item, StateUpdateType.Delete);
            }
        });
    }

    protected sendUpdateEvent<T>(subject: Subject<StateUpdate<T>>, data: T, type: StateUpdateType) {
        subject.next({ data, type });
    }
}
