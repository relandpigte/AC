import { Subject, Subscription } from 'rxjs';
import { AppStateActionNames, AppStateFeatures} from './pub-sub.service';

export interface StateUpdate<T> {
    data: T;
    type: StateUpdateType;
    silent?: boolean;
}

export enum StateUpdateType {
    Add = 'add',
    Update = 'update',
    Delete = 'delete',
    Silent = 'silent'
}

export abstract class StateServiceBase {
    private subscriptions: Subscription[] = [];
    actionArgs: { [key in AppStateActionNames]?: any };
    features?: AppStateFeatures;

    abstract loadData(component: any, userId: number): Promise<void>;
    protected abstract setupSubscriptions(component: any, userId: number): Promise<Subscription | Subscription[] | null>;

    get loadArgs() { return [].concat(!this.actionArgs?.['load'] || typeof this.actionArgs['load'] === 'boolean' ? [] : this.actionArgs['load']); }
    get updateArgs() { return [].concat(!this.actionArgs?.['update'] || typeof this.actionArgs['update'] === 'boolean' ? [] : this.actionArgs['update']); }

    async start(component: any, userId: number, features?: AppStateFeatures): Promise<void> {
        await this.startSubscriptions(component, userId, features);
        await this.loadData(component, userId);
    }

    async stop(): Promise<void> {
        await this.stopSubscriptions();
    }

    async startSubscriptions(component: any, userId: number, features?: AppStateFeatures): Promise<void> {
        await this.stopSubscriptions();
        this.features = features;
        this.subscriptions = [].concat(await this.setupSubscriptions(component, userId)).filter(s => s);
    }

    async stopSubscriptions(): Promise<void> {
        this.subscriptions?.forEach(s => s.unsubscribe());
        this.subscriptions = [];
    }

    protected updateFromMap<T extends U, U>(existingMap: Map<string, T>, updateMap: { [key: string]: U }, updateSub$: any, silent?: boolean) {
        const updateKeys = Object.keys(updateMap);
        updateKeys.forEach(k => {
            if (updateMap[k]) {
                const type = existingMap.has(k) ? StateUpdateType.Update : StateUpdateType.Add;
                existingMap.set(k, { ...existingMap.get(k), ...updateMap[k] } as T);
                this.sendUpdateEvent(updateSub$, existingMap.get(k), type, silent);
            } else {
                const item = existingMap.get(k);
                existingMap.delete(k);
                this.sendUpdateEvent(updateSub$, item, StateUpdateType.Delete, silent);
            }
        });
    }

    protected sendUpdateEvent<T>(subject: Subject<StateUpdate<T>>, data: T, type: StateUpdateType, silent?: boolean) {
        subject.next({ data, type, silent });
    }
}
