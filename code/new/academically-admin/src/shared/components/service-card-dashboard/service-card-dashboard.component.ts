import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import {
  DefaultServiceCardActions,
  DefaultServiceCardOptions,
  ServiceCard,
  ServiceCardButton, ServiceCardComposition, ServiceCardImage,
  ServiceCardOptions,
  ServiceCardPeople,
  ServiceCardPerson, ServiceCardStatus,
  ServiceCardType, UserServiceCardActions
} from '@shared/models/service-card.model';
import {
  ArticleDto,
  ArticleStatus,
  ArticleType,
  CoachingDto,
  CourseDto,
  EventCategory,
  EventDto,
  UserDto,
  VideoDto
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-service-card-dashboard',
  templateUrl: './service-card-dashboard.component.html',
  styleUrls: ['./service-card-dashboard.component.less']
})
export class ServiceCardDashboardComponent extends AppComponentBase implements OnInit {
  @Input() data: any;
  @Input() isLoading: boolean;
  @Input() isCreator: boolean;
  @Input() options: ServiceCardOptions;
  @Input() actions: ServiceCardButton[];

  @Output() onDelete: Subject<any> = new Subject<any>();
  @Output() onClickAction: Subject<any> = new Subject<any>();

  sanitized: ServiceCard;
  sanitizedOptions: ServiceCardOptions;
  sanitizedActions: ServiceCardButton[];

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get id(): string { return this.data?.id; }
  get cardType(): ServiceCardType { return this.sanitized?.type; }
  get images(): ServiceCardImage[] { return this.sanitized?.images; }
  get name(): string { return this.sanitized?.name; }
  get info(): string { return this.sanitized?.info; }
  get articleType(): number { return this.data?.type; }
  get people(): ServiceCardPeople { return this.sanitized?.people; }
  get status(): ServiceCardStatus { return this.sanitized?.status; }
  get learners(): number { return 20; }
  get progress(): number | null {
    if (this.status?.type === 'completed') { return null; }
    return this.sanitized?.progress ?? 0;
  }
  get composition(): ServiceCardComposition { return this.sanitized?.composition; }
  get compositionString(): string {
    if (!this.composition) { return null; }
    const composition = [];
    _.forEach(this.composition, (value, key) => {
      composition.push(`${value} ${key}`);
    });
    return composition.join(', ');
  }
  get compositionVideoDuration(): string { return this.composition?.durationInSec ? moment.utc(this.composition?.durationInSec * 1000).format(`${this.composition?.durationInSec >= 3600 ? 'HH:' : ''}mm:ss`) : null; }
  get isArchive(): boolean { return this.sanitized?.status?.type === 'archived'; }

  ngOnInit(): void {
    this.sanitizedData();
  }

  handleDelete(id: string): void {
    this.onDelete.next(id);
  }

  handleClickAction(data: any): void {
    this.onClickAction.next(data);
  }

  private sanitizedData(): void {
    this.sanitized = <ServiceCard>{};
    this.sanitizedOptions = _.merge({}, DefaultServiceCardOptions, this.options);
    this.sanitizedActions = _.merge([], DefaultServiceCardActions, this.actions);

    this.sanitized.type = this.getCardType();
    this.sanitized.name = this.data?.name;
    this.sanitized.info = this.data?.description;
    this.sanitized.images = [{ src: this.data.thumbnailImageUrl ?? 'assets/img/img-placeholder.png' }];

    this.sanitized.people = <ServiceCardPeople>{};
    this.sanitized.people.people = Array(this.randomNonZero(45, 12))
      .fill({} as ServiceCardPerson).map(i => ({
        ...this.sanitized.owner, avatar: {
          src: `https://i.pravatar.cc/50?u=${this.uuidv4()}`
        }
      }));
    this.sanitized.people.avatarStackCount = 3;

    this.setValueOverrides();
    this.setOptionOverrides();
  }

  private setValueOverrides(): void {
    switch (this.cardType) {
      case 'article':
        this.sanitized.people.isShowAvatars = true;
        this.sanitized.status = this.isCreator ?
          <ServiceCardStatus>{ type: 'published', label: 'Published', show: true } :
          <ServiceCardStatus>{ type: 'read', label: 'You’ve read this', show: true };
        this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'read', label: 'Read again' });
        break;
      case 'broadcast':
        break;
      case 'coaching':
        break;
      case 'course':
        this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
        this.sanitized.composition.units = this.data?.units ?? 4;
        this.sanitized.composition.modules = this.data?.modules ?? 3;
        this.sanitized.composition.lessons = this.data?.lessons ?? 5;
        this.sanitized.status = this.isCreator ?
          <ServiceCardStatus>{ type: 'published', label: 'Published', show: true } :
          <ServiceCardStatus>{ type: 'onprogress', label: 'Lesson 1 - Start your new journey', show: true };
        this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Start course' });
        this.sanitized.progress = this.data?.progress;
        this.sanitized.people.isShowAvatars = true;
        break;
      case 'event':
        break;
      case 'space':
        break;
      case 'tutorial':
        this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
        this.sanitized.composition.videos = 1;
        this.sanitized.composition.durationInSec = Math.floor(Math.random() * (3600 - 20) + 20);

        if (this.isCreator) {
          this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
        } else {
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch(tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'onprogress', label: 'Tutorial 1 - Start your new journey', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Play Tutorial' });
              this.sanitized.progress = 0;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'onprogress', label: 'Tutorial 1 - Start your new journey', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Continue' });
              this.sanitized.progress = Math.floor(Math.random() * (100 - 1) + 1);
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You\'ve finished this tutorial.', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              this.sanitized.progress = null;
              break;
            case 4:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You\'ve finished this tutorial.', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Play again' });
              this.sanitized.progress = null;
              break;
          }
        }
        break;
      case 'workshop':
        break;
    }
  }

  private setOptionOverrides(): void {
    switch (this.cardType) {
      case 'article':
        if (!this.options || !('isShowInfo' in this.options)) { this.sanitizedOptions.isShowInfo = true; }
        if (!this.options || !('isShowImages' in this.options)) { this.sanitizedOptions.isShowImages = false; }
        if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isSHowPurchased = true; }
        break;
      case 'broadcast':
        break;
      case 'coaching':
        break;
      case 'course':
        if (!this.options || !('isShowProgress' in this.options)) { this.sanitizedOptions.isShowProgress = true; }
        if (!this.options || !('isShowDetailsComposition' in this.options)) { this.sanitizedOptions.isShowDetailsComposition = true; }
        if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isShowEnrolled = true; }
        break;
      case 'event':
        break;
      case 'space':
        break;
      case 'tutorial':
        if (!this.options || !('isShowProgress' in this.options)) { this.sanitizedOptions.isShowProgress = true; }
        if (!this.options || !('isShowQuickPreview' in this.options)) { this.sanitizedOptions.isShowQuickPreview = true; }
        break;
      case 'workshop':
        break;
    }
  }

  private getCardType(): ServiceCardType {
    switch (this.data?.constructor) {
      case EventDto: {
        const { category } = this.data as EventDto;
        if (category === EventCategory.Broadcast) {
          return 'broadcast';
        }
        return 'workshop';
      }
      case ArticleDto: return 'article';
      case CoachingDto: return 'coaching';
      case CourseDto: return 'course';
      case VideoDto: return 'tutorial';
      case UserDto: return 'user';
    }
    return null;
  }
}
