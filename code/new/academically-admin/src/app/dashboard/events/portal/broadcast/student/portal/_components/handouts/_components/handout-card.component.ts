import { ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceHandoutDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-handout-card',
    templateUrl: './handout-card.component.html',
    styleUrls: ['./handout-card.component.less']
})
export class HandoutCardComponent extends AppComponentBase {
    @Input() handout: (ServiceHandoutDto & { customClass?: string });

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef
    ) {
        super(injector);
    }

    get isOwner(): boolean { return this.handout.creatorUserId === this.appSession.userId; }
    get ownerFirstName(): string { return this.handout.creatorUser.name; }
    get customClass(): string { return this.handout.customClass ?? ''; }
}
