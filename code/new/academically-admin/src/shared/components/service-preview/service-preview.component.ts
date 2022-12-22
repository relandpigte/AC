import { Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCard, ServiceCardComposition, ServiceCardOptions, ServiceCardPeople, ServiceCardPerson, ServiceCardReview, ServiceCardRsvp, ServiceCardSlots } from '@shared/models/service-card.model';
import { AvailableServiceDto } from '@shared/service-proxies/service-proxies';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-service-preview',
    templateUrl: './service-preview.component.html',
    styleUrls: ['./service-preview.component.scss'],
    animations: [appModuleAnimation()]
})
export class ServicePreviewComponent extends AppComponentBase implements OnChanges {
    @Input() service: AvailableServiceDto;
    @Input() canRemove: boolean = true;

    @Output() onRemove = new EventEmitter<any>();

    sanitized: ServiceCard;
    sanitizedOptions: ServiceCardOptions;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    get thumbnailImageUrl(): string { return this.service?.thumbnailImageUrl ? this.service.thumbnailImageUrl : 'assets/img/img-placeholder.png'; }
    get creatorName(): string { return this.service?.creatorUser?.fullName ? this.service.creatorUser.fullName : 'Anonymous'; }
    get creatorProfilePictureUrl(): string { return this.service?.creatorUser?.profilePictureUrl ? this.service.creatorUser.profilePictureUrl : 'assets/img/anonymous.png'; }

    get serviceType(): string { return this.sanitized?.type; }
    get serviceName(): string { return this.service?.name; }
    get priceValue(): number { return this.sanitized?.price?.price ?? 0; }
    get priceCurrency(): string { return this.sanitized?.price?.currency ? this.sanitized.price.currency : 'GBP'; }
    get priceSuffix(): string { return this.sanitized?.price?.suffix; }
    get composition(): ServiceCardComposition { return this.sanitized?.composition; }
    get compositionVideoDuration(): string { return this.composition?.durationInSec ? moment.utc(this.composition?.durationInSec * 1000).format(`${this.composition?.durationInSec >= 3600 ? 'HH:' : ''}mm:ss`) : null; }
    get compositionVideoString(): string { return `${this.composition?.videos} videos`; }
    get compositionString(): string {
      const comp = [];
      if (this.sanitized?.composition?.articles) comp.push(`${this.sanitized?.composition?.articles} articles`);
      if (this.sanitized?.composition?.broadcasts) comp.push(`${this.sanitized?.composition?.broadcasts} broadcasts`);
      if (this.sanitized?.composition?.lessons) comp.push(`${this.sanitized?.composition?.lessons} lessons`);
      if (this.sanitized?.composition?.modules) comp.push(`${this.sanitized?.composition?.modules} modules`);
      if (this.sanitized?.composition?.sessions) comp.push(`${this.sanitized?.composition?.sessions} sessions`);
      if (this.sanitized?.composition?.videos) comp.push(`${this.sanitized?.composition?.videos} videos`);
      if (this.sanitized?.composition?.workshops) comp.push(`${this.sanitized?.composition?.workshops} workshops`);
      return comp.join(', ');
    }
    get lastActive(): string { return (!!this.sanitized?.dates?.lastActiveDate) ? this.l('LastActive', this.convertMomentToDateAgo(this.sanitized.dates.lastActiveDate)) : null; }
    get slots(): ServiceCardSlots { return this.sanitized?.slots; }
    get slotsCount(): number { return this.sanitized?.slots?.left ?? 0; }
    get slotsUnit(): string { return this.sanitized?.slots?.unit ?? 'space'; }
    get rsvp(): ServiceCardRsvp { return this.sanitized?.rsvp; }
    get rsvpString(): string {
      const rsvp = [];
      if (this.sanitized?.rsvp?.going) rsvp.push(`${this.sanitized?.rsvp?.going} going`);
      if (this.sanitized?.rsvp?.interested) rsvp.push(`${this.sanitized?.rsvp?.interested} interested`);
      return rsvp.join(', ');
    }
    get reviews(): ServiceCardReview { return this.sanitized?.reviews; }
    get reviewValue(): number { return this.reviews?.value; }
    get reviewStar(): boolean { return this.reviews?.hasStar; }
    get reviewCount(): number { return this.reviews?.count; }
    get owner(): ServiceCardPerson { return this.sanitized?.owner; }
    get people(): ServiceCardPeople { return this.sanitized?.people; }

    ngOnChanges(changes: SimpleChanges): void {
        if ('service' in changes && this.service) {
            const {options, service} = ServiceCardUtils.getSanitizeServiceData(this.service, {}, [], false);
            this.sanitized = service;
            this.sanitizedOptions = options;
        }
    }

    removeService(): void {
        this.onRemove.emit();
    }
}
