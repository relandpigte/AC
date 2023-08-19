import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import {
  DefaultServiceCardActions,
  DefaultServiceCardOptions,
  ServiceCard,
  ServiceCardButton, ServiceCardComposition, ServiceCardDates, ServiceCardImage,
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
import * as humanizeDuration from 'humanize-duration';

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

  @Input() additionalData: any = {};

  @Input() isOverview: boolean;

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
      if (this.cardType === 'tutorial' && key === 'durationInSec') { return; }
      composition.push(`${value} ${key}`);
    });
    return composition.join(', ');
  }
  get compositionVideoDuration(): string { return this.composition?.durationInSec ? moment.utc(this.composition?.durationInSec * 1000).format(`${this.composition?.durationInSec >= 3600 ? 'HH:' : ''}mm:ss`) : null; }
  get isDraft(): boolean { return this.sanitized?.status?.type === 'draft'; }
  get isArchive(): boolean { return this.sanitized?.status?.type === 'archived'; }
  get isExpired(): boolean { return this.sanitized.dates.startDate.isBefore(moment()); }
  get sessionDuration(): string { return humanizeDuration(this.composition.durationInSec * 1000); }
  get isScheduleNear(): boolean { return this.sanitized?.dates?.startDate.diff(moment(), 'hours') < 1; }
  get schedule(): string {
    if (this.isDraft || !this.sanitized?.dates?.startDate) return this.l('Unscheduled');
    if (this.sanitized.dates.startDate.diff(moment(), 'minutes') < 1) return this.l('LiveNow');
    else if (this.sanitized.dates.startDate.diff(moment(), 'hours') < 1) return this.l('StartingIn', this.convertMomentToDateAgo(this.sanitized.dates.startDate, true));
    return this.l('StartingFrom', this.sanitized.dates.startDate.format('dddd, DD MMMM YYYY'), this.sanitized.dates.startDate.format('HH:mm'), this.sanitized.dates.endDate.format('HH:mm'));
  }
  get scheduleDay(): string { return this.isDraft ? '--' : this.sanitized?.dates?.startDate?.format('DD'); }
  get scheduleMonth(): string { return this.isDraft ? '---' : this.sanitized?.dates?.startDate?.format('MMM'); }
  get isBooked():boolean { return !!this.sanitized?.booking; }
  get coachingStudentFullName(): string { return this.sanitized?.booking?.student?.fullName ?? 'Casey Fyfe'; }
  get coachingStudentAvatarSrc(): string { return this.sanitized?.booking?.student?.avatar?.src ?? 'assets/img/anonymous.png'; }
  get coachingDuration(): string { return humanizeDuration(this.sanitized?.booking?.durationInSec ?? 60000); }

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

    const tempDate = moment().add(Math.floor(Math.random() * (2 - 1) + 1), 'days');
    this.sanitized.dates = {} as ServiceCardDates;
    this.sanitized.dates.startDate = this.data.eventDateTime ?? tempDate;
    this.sanitized.dates.endDate = this.data.endDate ?? tempDate.add(Math.floor(Math.random() * (2 - 1) + 1), 'minutes');

    this.sanitized.owner = {} as ServiceCardPerson;
    this.sanitized.owner.avatar = {} as ServiceCardImage;
    this.sanitized.owner.avatar.src = this.data?.creatorUser?.profilePictureUrl ?? this.data.profilePictureUrl ?? 'assets/img/anonymous.png';
    this.sanitized.owner.fullName = this.data?.creatorUser?.fullName?? this.data.fullName ??  'Anonymous';
    this.sanitized.owner.isShowAvatar = true;
    this.sanitized.owner.isShowFullName = true;

    this.sanitized.booking = this.data?.booking;

    this.sanitized = { ...this.sanitized, ...this.additionalData };

    this.setValueOverrides();
    this.setOptionOverrides();
  }

  private setValueOverrides(): void {
    switch (this.cardType) {
      case 'article':
        this.sanitized.people.isShowAvatars = true;
        if (this.isCreator) {
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
          }
        } else {
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'unread', label: 'Unread', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'read', label: 'Read' });
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'You’ve read this.', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'read', label: 'Read Again' });
              this.sanitizedOptions.isShowActions = true;
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'You’ve read this', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              this.sanitizedOptions.isShowActions = true;
              break;
          }
        }
        break;
      case 'broadcast':
        this.sanitized.people.isShowAvatars = true;
        if (this.isCreator) {
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join workshop' });
              this.sanitizedOptions.isShowActions = true;
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
          }
        } else {
          this.sanitizedOptions.isShowActions = true;
          if (this.isExpired) {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
          } else {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join workshop' });
          }
        }
        break;
      case 'coaching':
        if (this.isCreator) {
          if (this.isBooked) {
            if (!this.isExpired) {
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join session' });
              this.sanitizedOptions.isShowActions = true;
            }
          } else {
            this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
            this.sanitized.composition.sessions = 1;
            this.sanitized.composition.durationInSec = Math.floor(Math.random() * (10000 - 20) + 20);
            this.sanitized.people.isShowAvatars = true;

            const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
            switch (tempStatus) {
              case 1:
                this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
                this.sanitizedOptions.isShowStatus = true;
                break;
              case 2:
                this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
                this.sanitizedOptions.isShowStatus = true;
                break;
              case 3:
                this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
                this.sanitizedOptions.isShowStatus = true;
                break;
            }
          }
        }
        break;
      case 'course':
        if (this.isCreator) {
          this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
          this.sanitized.composition.units = this.data?.units ?? 4;
          this.sanitized.composition.modules = this.data?.modules ?? 3;
          this.sanitized.composition.lessons = this.data?.lessons ?? 5;
          this.sanitized.people.isShowAvatars = true;

          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join workshop' });
              this.sanitizedOptions.isShowActions = true;
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
          }
        } else {
          this.sanitized.progress = this.data?.progress;
          const tempStatus = Math.floor(Math.random() * (5 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Start course' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.status = <ServiceCardStatus>{ type: 'read', label: 'Lesson 1 - Start your new journey', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitized.progress = 0;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'onprogress', label: 'Tutorial 1 - Start your new journey', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Continue' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = Math.floor(Math.random() * (100 - 1) + 1);
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You’ve finished this course', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
            case 4:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You’ve finished this course', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Start again' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
          }
        }
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
          this.sanitized.people.isShowAvatars = true;
          this.sanitized.composition.videos = 20;
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join workshop' });
              this.sanitizedOptions.isShowActions = true;
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
          }
        } else {
          const tempStatus = Math.floor(Math.random() * (5 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'onprogress', label: 'Tutorial 1 - Start your new journey', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Play Tutorial' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = 0;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'onprogress', label: 'Tutorial 1 - Start your new journey', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Continue' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = Math.floor(Math.random() * (100 - 1) + 1);
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You\'ve finished this tutorial.', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
            case 4:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You\'ve finished this tutorial.', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Play again' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
          }
        }
        break;
      case 'workshop':
        this.sanitized.people.isShowAvatars = true;
        if (this.isCreator) {
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch(tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join workshop' });
              this.sanitizedOptions.isShowActions = true;
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              this.sanitizedOptions.isShowStatus = true;
              break;
          }
        }
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
        if (!this.options || !('isShowDate' in this.options)) { this.sanitizedOptions.isShowDate = true; }
        if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
        if (!this.options || !('headingType' in this.options)) { this.sanitizedOptions.headingType = 'schedule'; }
        if (!this.options || !('isShowGoing' in this.options)) { this.sanitizedOptions.isShowGoing = true; }
        break;
      case 'coaching':
        if (this.isBooked) {
          if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
          if (!this.options || !('headingType' in this.options)) { this.sanitizedOptions.headingType = 'schedule'; }
          if (!this.options || !('isShowMajorParticipants' in this.options)) { this.sanitizedOptions.isShowMajorParticipants = true; }
          if (!this.options || !('isShowCoachingDetails' in this.options)) { this.sanitizedOptions.isShowCoachingDetails = true; }
        } else {
          if (!this.options || !('isShowQuickPreview' in this.options)) { this.sanitizedOptions.isShowQuickPreview = true; }
          if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isSHowPurchased = true; }
        }
        break;
      case 'course':
        if (!this.options || !('isShowProgress' in this.options)) { this.sanitizedOptions.isShowProgress = true; }
        if (!this.options || !('isShowDetailsComposition' in this.options)) { this.sanitizedOptions.isShowDetailsComposition = true; }
        if (!this.options || !('isShowEnrolled' in this.options)) { this.sanitizedOptions.isShowEnrolled = true; }
        break;
      case 'event':
        break;
      case 'space':
        break;
      case 'tutorial':
        if (!this.options || !('isShowProgress' in this.options)) { this.sanitizedOptions.isShowProgress = true; }
        if (!this.options || !('isShowQuickPreview' in this.options)) { this.sanitizedOptions.isShowQuickPreview = true; }
        if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isSHowPurchased = true; }
        if (!this.options || !('isShowDetailsComposition' in this.options)) { this.sanitizedOptions.isShowDetailsComposition = true; }
        break;
      case 'workshop':
        if (!this.options || !('headingType' in this.options)) { this.sanitizedOptions.headingType = 'schedule'; }
        if (!this.options || !('isShowDate' in this.options)) { this.sanitizedOptions.isShowDate = true; }
        if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
        if (!this.options || !('isShowGoing' in this.options)) { this.sanitizedOptions.isShowGoing = true; }
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
