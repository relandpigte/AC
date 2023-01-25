import { Injectable } from '@angular/core';
import { AppSessionService } from '@shared/session/app-session.service';
import { StateServiceBase } from './state-base.service';

export enum NotificationName {
    PostCreated = 'Notifications.Post.Created',
    PostUpdated = 'Notifications.Post.Updated'
};

export enum AppStateType {
    Post = 'post'
}

export type AppStateConfig = {
    [key in AppStateType]?: AppStateActions
};

export interface AppStateActions {
    load: boolean;
    update: boolean;
}

export type AppStateServices = {
    [key in AppStateType]?:  {
        type: new(...args) => any;
        args: any[];
    }
};

@Injectable({ providedIn: 'root' })
export class PubSubService {
    private allStateServices: Map<AppStateType, StateServiceBase> = new Map();
    private servicesToLoad: StateServiceBase[];
    private servicesToUpdate: StateServiceBase[];

    constructor(
        private _appSessionService: AppSessionService
    ) {}

    async start(component: any, config: AppStateConfig, services: AppStateServices) {
        this.initializeServices(services);

        const userId = this._appSessionService.userId;

        this.servicesToLoad = this.getServicesFromConfig(config, a => a.load);
        await Promise.all(this.servicesToLoad.map(s => s.loadData(component, userId)));

        this.servicesToUpdate = this.getServicesFromConfig(config, a => a.update);
        await Promise.all(this.servicesToUpdate.map(s => s.startSubscriptions(component, userId)));
    }

    private initializeServices(services: AppStateServices) {
        Object.keys(services).forEach((notificationType: AppStateType) => {
            const { type, args } = services[notificationType];
            this.allStateServices.set(notificationType, new type(...args));
        });
    }

    private getServicesFromConfig(config?: AppStateConfig, predicate?: (a: AppStateActions) => boolean) {
        const services = config
            ? Object.keys(config).filter((k: any) => !predicate || predicate(config[k])).map((k: any) => this.allStateServices.get(k))
            : Array.from(this.allStateServices.values());
        return services as StateServiceBase[];
    }

    async stop() {
        await Promise.all(Array.from(this.allStateServices.values()).map(x => x.stop()));
    }

    async restart(component, config: AppStateConfig, services: AppStateServices) {
        await this.stop();
        await this.start(component, config, services);
    }

    async startSubscriptions(component: any, tags?: string[]) {
        const userId = this._appSessionService.userId;
        await Promise.all(this.servicesToUpdate.map(x => x.startSubscriptions(component, userId)));
    }

    async stopSubscriptions() {
        await Promise.all(this.servicesToUpdate.map(x => x.stopSubscriptions()));
    }
}
