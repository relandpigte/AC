import { TitleCasePipe } from '@angular/common';
import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceHandoutDto } from '@shared/service-proxies/service-proxies';
import { StateUpdateType } from '@shared/services/state-base.service';

export interface PortalHandoutEventData {
    handout?: ServiceHandoutDto;
    event: StateUpdateType;
    customClass?: string;
}

@Component({
    selector: 'app-handout-card',
    templateUrl: './handout-card.component.html',
    styleUrls: ['./handout-card.component.less'],
    providers: [ TitleCasePipe ]
})
export class HandoutCardComponent extends AppComponentBase {
    @Input() handout: PortalHandoutEventData;

    protected readonly ownerEventToTextKeyMap: { [key in StateUpdateType]?: string } = {
        [StateUpdateType.Update]: 'Handouts.Event.Shared.Owner',
        [StateUpdateType.Delete]: 'Handouts.Event.Deleted.Owner',
    };

    protected readonly attendeeEventToTextKeyMap: { [key in StateUpdateType]?: string } = {
        [StateUpdateType.Add]: 'Handouts.Event.Shared.Attendee',
    }

    constructor(
        injector: Injector,
        private titleCasePipe: TitleCasePipe
    ) {
        super(injector);
    }
    get event(): StateUpdateType { return this.handout.event; }
    get serviceHandout(): ServiceHandoutDto { return this.handout?.handout; }
    get isOwner(): boolean { return this.serviceHandout?.creatorUserId === this.appSession.userId; }
    get ownerFirstName(): string { return this.titleCasePipe.transform(this.serviceHandout?.creatorUser.name ?? 'Anonymous'); }
    get customClass(): string { return this.handout.customClass ?? ''; }
    get toastMessage(): string { return this.isOwner ? this.l(this.ownerEventToTextKeyMap[this.event]) : this.l(this.attendeeEventToTextKeyMap[this.event], this.ownerFirstName); }
}
