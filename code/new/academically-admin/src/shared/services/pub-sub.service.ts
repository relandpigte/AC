import { Injectable } from '@angular/core';
import { AppSessionService } from '@shared/session/app-session.service';
import { StateServiceBase } from './state-base.service';

export type AppStateConfig = {
    [key: string]: AppStateActions
};

export interface AppStateActions {
    load?: any;
    update?: any;
}

export type AppStateActionNames = keyof AppStateActions;

export type AppStateServices = {
    [key: string]:  {
        type: new(...args) => any;
        args: any[];
    }
};

export type AppStateFeatures = {
    [key: string]: boolean
}

@Injectable({ providedIn: 'root' })
export class PubSubService {
    private allStateServices: Map<string, StateServiceBase> = new Map();
    private servicesToLoad: StateServiceBase[];
    private servicesToUpdate: StateServiceBase[];

    constructor(
        private _appSessionService: AppSessionService
    ) {}

    getStateService<T extends StateServiceBase> (key: string): T {
        return this.allStateServices.get(key) as T;
    }

    async start(component: any, config: AppStateConfig, services: AppStateServices, features?: AppStateFeatures) {
        this.initializeServices(services, config);

        const userId = this._appSessionService.userId;

        this.servicesToLoad = this.getServicesFromConfig(config, a => !!a.load);
        await Promise.all(this.servicesToLoad.map(s => s.loadData(component, userId)));

        this.servicesToUpdate = this.getServicesFromConfig(config, a => !!a.update);
        await Promise.all(this.servicesToUpdate.map(s => s.startSubscriptions(component, userId, features)));
    }

    private initializeServices(services: AppStateServices, config: AppStateConfig) {
        Object.keys(services).forEach((key: string) => {
            const { type, args } = services[key];
            const service = new type(...args);
            const serviceConf = config[key];
            service['actionArgs'] = { load: serviceConf.load, update: serviceConf.update };
            this.allStateServices.set(key, service);
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
