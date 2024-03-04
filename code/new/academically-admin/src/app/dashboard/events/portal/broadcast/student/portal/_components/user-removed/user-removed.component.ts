import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServicesType } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-user-removed',
    templateUrl: './user-removed.component.html',
    styleUrls: ['./user-removed.component.less'],
    animations: [appModuleAnimation()]
})
export class UserRemovedComponent extends AppComponentBase {
    @Input() serviceType: ServicesType;

    constructor(
        injector: Injector,
        private _router: Router,
    ) {
        super(injector);
    }

    get serviceTypeName(): string { return ServiceCardUtils.getServiceTypeObject(this.serviceType); }

    goToDashboard(): void {
        switch(this.serviceType) {
            case ServicesType.Event:
            case ServicesType.Workshop:
                this._router.navigate(['app', 'dashboard', 'events']);
        }
    }
}
