import { Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AppComponentBase } from '@shared/app-component-base';
import { AvailableServiceDto, ProfilesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ServiceCard, ServiceCardComposition, ServiceCardOptions, ServiceCardReview, ServiceCardRsvp, ServiceCardSlots } from '@shared/models/service-card.model';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

@Component({
  selector: 'app-preview-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  animations: [appModuleAnimation()]
})
export class PreviewServicesComponent extends AppComponentBase implements OnChanges {
  @Input() data: AvailableServiceDto;
  @Input() canRemove: boolean;
  @Input() sharedServiceType: number;

  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();

  sanitized: ServiceCard;
  sanitizedOptions: ServiceCardOptions;

  constructor(injector: Injector, private _profileService: ProfilesServiceProxy) {
    super(injector);
  }

  get thumbnailImageUrl(): string { return this.data?.thumbnailImageUrl ?? 'assets/img/img-placeholder.png'; }
  get creatorName(): string { return this.data?.creatorUser?.fullName ?? 'Anonymous'; }
  get creatorProfilePictureUrl(): string { return this.data?.creatorUser?.profilePictureUrl ?? 'assets/img/anonymous.png'; }
  get serviceTypeName(): string { return this.sanitized?.type; }
  get serviceName(): string { return this.sanitized?.name; }
  get priceValue(): number { return this.sanitized?.price?.price ?? 0; }
  get priceCurrency(): string { return this.sanitized.price.currency ?? 'GBP'; }
  get priceSuffix(): string { return this.sanitized?.price?.suffix; }
  get compositionString(): string { return this.handleCompositionString(this.sanitized?.composition); }
  get lastActive(): string { return this.handleLastActive(this.sanitized?.dates); }
  get slotsCount(): number { return this.sanitized?.slots?.left ?? 0; }
  get slotsUnit(): string { return this.sanitized?.slots?.unit ?? 'space'; }
  get rsvpString(): string { return this.handleRsvpString(this?.rsvp); }
  get reviewValue(): number { return this.reviews?.value; }
  get reviewStar(): boolean { return this.reviews?.hasStar; }
  get reviewCount(): number { return this.reviews?.count; }
  get composition(): ServiceCardComposition { return this.sanitized?.composition; }
  get slots(): ServiceCardSlots { return this.sanitized?.slots; }
  get rsvp(): ServiceCardRsvp { return this.sanitized?.rsvp; }
  get reviews(): ServiceCardReview { return this.sanitized?.reviews; }

  get serviceContent(): string { return this.data?.description; }
  get servicesType() { return ServicesType; }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      const {options, service} = ServiceCardUtils.getSanitizeServiceData(this.data, {}, [], false);
      this.sanitized = service;
      this.sanitizedOptions = options;
    }
  }

  handleCompositionString(composition: object): string {
    if (composition == null) { return; }

    const ArrComp: string[] = [];
    const ArrTemp: string[] = ['articles', 'broadcasts', 'lessons', 'modules', 'sessions', 'videos', 'workshops'];
    for (const t of ArrTemp) {
      if (composition[t] >= 0) {
        ArrComp.push(`${composition[t]} ${t}`);
      }
    }
    return ArrComp.join(', ');
  }

  handleRsvpString(rsvp: object): string {
    if (rsvp == null) { return; }

    const ArrRsvp: string[] = [];
    const ArrTemp: string[] = ['going', 'interested'];
    for (const t of ArrTemp) {
      if (rsvp[t] >= 0) {
        ArrRsvp.push(`${rsvp[t]} ${t}`);
      }
    }
    return ArrRsvp.join(', ');
  }

  handleLastActive(dates: any): string {
    return (!!dates.lastActiveDate) ?
      this.l('LastActive', this.convertMomentToDateAgo(dates.lastActiveDate)) : null;
  }

  removeService(): void {
    this.onRemove.emit();
  }
}
