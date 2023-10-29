import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AvailableServiceDto, ServicesType } from '@shared/service-proxies/service-proxies';

export interface ServiceReference {
  isSquareImg?: boolean;
  isCircleImg?: boolean;
  isRectangleImg?: boolean;
  isImgShown?: boolean;
  isVideoShown?: boolean;
  isDescriptionShown?: boolean;
  isScheduleShown?: boolean;
  isAuthorShown?: boolean;
  isCompositionsShown?: boolean;
  img?: string;
  schedule?: string;
  title?: string;
  description?: string;
  author?: string;
  composition?: string;
}

@Component({
  selector: 'app-preview-service-reference',
  templateUrl: './service-reference.component.html',
  styleUrls: ['./service-reference.component.scss']
})
export class PreviewServiceReferenceComponent extends AppComponentBase implements OnInit {
  @Input() service: AvailableServiceDto;

  ServicesType = ServicesType;

  model: ServiceReference = {};

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.model.img = this.service?.thumbnailImageUrl || 'assets/img/img-placeholder.png';
    this.model.schedule = this.service?.eventDateTime ? this.convertMomentToShorterPostDateFormat(this.service.eventDateTime) : null;
    this.model.title = this.service?.name;
    this.model.description = this.service?.description;
    this.model.author = this.service?.creatorUser?.fullName;
    const composition = [];
    if (this.service?.modules) composition.push(`${this.service?.modules} modules`);
    if (this.service?.lessons) composition.push(`${this.service?.lessons} lessons`);
    this.model.composition = composition.join(' · ');

    this.model.isSquareImg = this.service.serviceType === ServicesType.Event;
    this.model.isCircleImg = this.service.serviceType === ServicesType.Coaching;
    this.model.isRectangleImg = !this.model.isSquareImg && !this.model.isCircleImg;
    this.model.isImgShown = this.service.serviceType !== ServicesType.Article && this.service.serviceType !== ServicesType.Tutorial;
    this.model.isVideoShown = this.service.serviceType !== ServicesType.Article && this.service.serviceType === ServicesType.Tutorial;
    this.model.isDescriptionShown = !!this.model.description && this.service.serviceType === ServicesType.Article;
    this.model.isScheduleShown = !!this.model.schedule && this.service.serviceType === ServicesType.Event;
    this.model.isAuthorShown = !!this.model.author && this.service.serviceType === ServicesType.Coaching;
    this.model.isCompositionsShown = !!this.model.composition && (this.service.serviceType === ServicesType.Course || this.service.serviceType === ServicesType.Tutorial);
  }
}
