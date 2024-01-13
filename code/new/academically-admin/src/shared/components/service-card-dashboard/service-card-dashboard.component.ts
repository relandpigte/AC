import { Component, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import * as humanizeDuration from 'humanize-duration';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';

import { RateAndReviewComponent } from '../rate-and-review/rate-and-review.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleStatus, ArticleType, CoachingStatus, CourseStatus, EventStatus, ServiceBookingDto, ServicesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import {
  DefaultServiceCardActions,
  DefaultServiceCardOptions,
  ServiceCard,
  ServiceCardButton,
  ServiceCardComposition,
  ServiceCardDates,
  ServiceCardImage,
  ServiceCardOptions,
  ServiceCardPeople,
  ServiceCardPerson,
  ServiceCardStatus,
  ServiceCardType
} from '@shared/models/service-card.model';
import { takeUntil } from 'rxjs/operators';

// classes of elements that won't allow triggering onRedirection event
const ISOLATED_CLICK_CLASSES = [
  'dropdown-toggle',
  'dropdown-item',
  'dropdown-toggle-icon'
];

@Component({
  selector: 'app-service-card-dashboard',
  templateUrl: './service-card-dashboard.component.html',
  styleUrls: ['./service-card-dashboard.component.less']
})
export class ServiceCardDashboardComponent extends AppComponentBase implements OnChanges {
  @Input() data: any;
  @Input() isLoading: boolean;
  @Input() isCreator: boolean;
  @Input() options: ServiceCardOptions;
  @Input() actions: ServiceCardButton[];
  @Input() isPast: boolean;
  @Input() isCancelled: boolean;
  @Input() additionalData: any = {};
  @Input() isOverview: boolean;
  @Input() isBooking: boolean;

  @Output() onDelete = new Subject<any>();
  @Output() onOverView = new Subject<any>();
  @Output() onEdit = new Subject<any>();
  @Output() onDuplicate = new Subject<any>();
  @Output() onPublish = new Subject<any>();
  @Output() onUnpublish = new Subject<any>();
  @Output() onArchive = new Subject<any>();
  @Output() onUnArchive = new Subject<any>();
  @Output() onRepurchase = new Subject<any>();
  @Output() onRearrangeSession = new Subject<any>();
  @Output() onCancelSession = new Subject<any>();
  @Output() onClickAction = new Subject<any>();
  @Output() onReviewAction = new Subject<any>();
  @Output() onRedirection = new Subject<any>();

  sanitized: ServiceCard;
  sanitizedOptions: ServiceCardOptions;
  sanitizedActions: ServiceCardButton[];
  booking: ServiceBookingDto;

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get id(): string { return this.data?.id; }
  get cardType(): ServiceCardType { return this.sanitized?.type; }
  get isEvent(): boolean { return this.cardType === 'broadcast' || this.cardType === 'workshop'; }
  get images(): ServiceCardImage[] { return this.sanitized?.images; }
  get name(): string { return this.sanitized?.name; }
  get info(): string { return this.sanitized?.info; }
  get people(): ServiceCardPeople { return this.sanitized?.people; }
  get status(): ServiceCardStatus { return this.sanitized?.status; }
  get learners(): number { return this.data?.enrolled?.length ?? this.data?.purchased?.length ?? 0; }
  get composition(): ServiceCardComposition { return this.sanitized?.composition; }
  get progress(): number | null {
    if (this.status?.type === 'completed') {
      return null;
    }
    return this.sanitized?.progress ?? 0;
  }
  get compositionString(): string {
    if (!this.composition) {
      return null;
    }
    const composition = [];
    _.forEach(this.composition, (value, key): void => {
      if (value > 0 && key !== 'durationInSec') {
        composition.push(`${value} ${key}`);
      }
    });
    return composition.join(', ');
  }
  get compositionVideoDuration(): string {
    return this.composition?.durationInSec ?
      moment.utc(this.composition?.durationInSec * 1000).format(`${this.composition?.durationInSec >= 3600 ? 'HH:' : ''}mm:ss`) :
      null;
  }
  get isDraft(): boolean {return this.sanitized?.status?.type === 'draft'; }
  get isArchive(): boolean { return this.sanitized?.status?.type === 'archived'; }
  get isPublished(): boolean { return this.sanitized?.status?.type === 'published'; }
  get isExpired(): boolean { return this.sanitized?.dates?.startDate?.isBefore(moment()); }
  get isUpcoming(): boolean { return this.sanitized?.dates?.startDate?.isAfter(moment()); }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get sessionDuration(): string { return humanizeDuration(this.composition.durationInSec * 1000); }
  get isScheduleNear(): boolean { return moment(this.sanitized?.dates?.startDate)?.diff(moment(), 'hours') < 1; }
  get schedule(): string {
    if (this.isDraft || !this.sanitized?.dates?.startDate) {
      return this.l('Unscheduled');
    }
    if (moment(this.sanitized?.dates?.startDate)?.diff(moment(), 'minutes') < 1 && !this.isExpired) {
      return this.l('LiveNow');
    } else if (moment(this.sanitized?.dates?.startDate).diff(moment(), 'hours') < 1 && !this.isExpired) {
      return this.l('StartingIn', this.convertMomentToDateAgo(this.sanitized?.dates?.startDate, true));
    }
    return this.l(
      'StartingFrom',
      moment(this.sanitized?.dates?.startDate)?.format('dddd, DD MMMM YYYY'),
      moment(this.sanitized?.dates?.startDate)?.format('HH:mm'),
      moment(this.sanitized?.dates?.startDate)?.add(this.data?.duration || 30, 'minutes')?.format('HH:mm')
    );
  }

  get scheduleDay(): string { return this.isDraft ? '--' : this.sanitized?.dates?.startDate?.format('DD'); }
  get scheduleMonth(): string { return this.isDraft ? '---' : this.sanitized?.dates?.startDate?.format('MMM'); }
  get isBooked(): boolean { return !!this.sanitized?.booking; }
  get coachingTutorFullName(): string { return this.sanitized.owner.fullName ?? 'Casey Fyfe'; }
  get coachingStudentFullName(): string { return this.data?.serviceBooking?.creatorUser?.fullName; }
  get coachingStudentAvatarSrc(): string { return this.data?.serviceBooking?.creatorUser?.profilePictureUrl ?? 'assets/img/anonymous.png'; }
  get coachingDuration(): string { return humanizeDuration(this.sanitized?.booking?.durationInSec ?? 60000); }
  get serviceStatus(): number { return this.data?.status; }
  get isCourseStarted(): boolean { return this.sanitized?.progress > 0 && this.sanitized?.progress < 100; }
  get isCourseCompleted(): boolean { return this.sanitized?.progress === 100; }
  get currentLesson(): string {
    const course = this.data?.studentCourses?.find(x => x.creatorUserId === this.currentUserId);

    let inProgress = course?.studentCourseSections?.find(x => x.status === 1);
    if (inProgress === undefined) {
      inProgress = course?.studentCourseSections[0];
    }
    return inProgress?.courseSection?.name;
  }

  get canRepurchase(): boolean { return this.onRepurchase.observers.length > 0; }
  get canRearrangeSession(): boolean { return this.onRearrangeSession.observers.length > 0; }
  get canCancelSession(): boolean { return this.onCancelSession.observers.length > 0; }

  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes && this.data) {
      const { options, service } = ServiceCardUtils.getSanitizeServiceData(this.data, {}, [], false);
      this.sanitized = service;
      this.sanitizedOptions = options;
      this.setInitValues();
    }
  }

  handleDelete(evt: any, id: string): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDelete.next(id);
  }

  handleOverView(evt: any, id: string): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onOverView.next(id);
  }

  handleEdit(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onEdit.next(this.data);
  }

  handleDuplicate(evt: any, id: string): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDuplicate.next(id);
  }

  handlePublish(evt: any, data: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onPublish.next(data);
  }

  handleUnpublish(evt: any, data: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onUnpublish.next(data);
  }

  handleArchive(evt: any, data: any):  void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onArchive.next(data);
  }

  handleUnArchive(evt: any, data: any):  void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onUnArchive.next(data);
  }

  handleOnReview(evt: any, data: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.onReviewAction.observers.length > 0) {
      this.onReviewAction.next(data);
    } else {
      const modalSettings = this.defaultModalSettings;
      modalSettings.class = 'modal-lg modal-dialog-centered';
      modalSettings.initialState = { serviceId: data.id };
      const modal = this._modalService.show(RateAndReviewComponent, modalSettings).content;

      modal.onClose.subscribe((): void => {
        this._modalService.hide();
      });
    }
  }

  handleRepurchase(evt: any, data: any):  void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onRepurchase.next(data);
  }

  handleRearrangeSession(evt: any, data: any):  void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onRearrangeSession.next(data);
  }

  handleCancelSession(evt: any, data: any):  void {
    evt.preventDefault();
    evt.stopPropagation();
    this.onCancelSession.next(data);
  }

  handleClickAction(evt: any, serviceId: string, action: ServiceCardButton): void {
    evt.preventDefault();
    evt.stopPropagation();
    switch (action.type) {
      case 'join':
        this.onClickAction.next(serviceId);
        break;
      case 'review':
        this.onReviewAction.next(this.data);
        break;
    }
  }

  handleRedirection(evt: any): void {
    if (ISOLATED_CLICK_CLASSES.some(c => evt.target.classList.contains(c))) return;
    evt.preventDefault();
    evt.stopPropagation();
    this.onRedirection.next(this.data);
  }

  private setInitValues(): void {
    this.sanitized.people = <ServiceCardPeople>{};
    this.sanitized.people.avatarStackCount = 3;
    this.sanitized.people.isShowAvatars = true;
    this.sanitized.people.people = Array(this.randomNonZero(25, 12))
      .fill({} as ServiceCardPerson).map(i => ({
        ...this.sanitized.owner, avatar: {
          src: `https://i.pravatar.cc/50?u=${this.uuidv4()}`
        }
      }));

    const tempDate = moment().add(Math.floor(Math.random() * (2 - 1) + 1), 'days');
    this.sanitized.dates = {} as ServiceCardDates;
    this.sanitized.dates.startDate = this.data.eventDateTime ?? tempDate;
    this.sanitized.dates.endDate = this.data.endDate ?? tempDate.add(Math.floor(Math.random() * (2 - 1) + 1), 'minutes');

    this.sanitized.owner = {} as ServiceCardPerson;
    this.sanitized.owner.avatar = {} as ServiceCardImage;
    this.sanitized.owner.avatar.src = this.data?.creatorUser?.profilePictureUrl ?? this.data?.profilePictureUrl ?? 'assets/img/anonymous.png';
    this.sanitized.owner.fullName = this.data?.creatorUser?.fullName ?? this.data.fullName ?? 'Anonymous';
    this.sanitized.owner.isShowAvatar = true;
    this.sanitized.owner.isShowFullName = true;

    this.sanitized = {...this.sanitized, ...this.additionalData};

    this.setValueOverrides();
    this.setOptionOverrides();
  }

  private setValueOverrides(): void {
    this.sanitizedOptions = _.merge({}, DefaultServiceCardOptions, this.options);
    this.sanitizedActions = _.merge([], DefaultServiceCardActions, this.actions);

    switch (this.cardType) {
      case 'article':
        if (this.isCreator) {
          switch (this.serviceStatus) {
            case ArticleStatus.Archived:
              this.sanitized.status = <ServiceCardStatus>{type: 'archived', label: 'Archived', show: true};
              break;
            case ArticleStatus.Published:
              this.sanitized.status = <ServiceCardStatus>{type: 'published', label: 'Published', show: true};
              break;
            case ArticleStatus.Draft:
              this.sanitized.status = <ServiceCardStatus>{type: 'draft', label: 'Draft', show: true};
              break;
          }
        } else {
          this.sanitized.people.isShowAvatars = false;
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{type: 'unread', label: 'Unread', show: true};
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'read', label: 'Read'});
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{type: 'completed', label: 'You’ve read this.', show: true};
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'read', label: 'Read Again'});
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{type: 'completed', label: 'You’ve read this', show: true};
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
              break;
          }
        }
        break;
      case 'workshop':
        if (this.isCreator) {
          this.sanitizedOptions.isShowStatus = true;
          if (EventStatus.Draft === this.serviceStatus) {
            this.sanitized.status = <ServiceCardStatus>{type: 'draft', label: 'Draft', show: true};
          }
          if (this.isExpired) {
            this.sanitized.status = <ServiceCardStatus>{type: 'archived', label: 'Published', show: true};
          }
          if (this.isUpcoming && EventStatus.Draft !== this.serviceStatus) {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Join workshop'});
            this.sanitized.status = <ServiceCardStatus>{type: 'published', label: 'Published', show: true};
            this.sanitizedOptions.isShowActions = true;
          }
        } else {
          this.sanitizedOptions.isShowStatus = false;
          if (this.isExpired) {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
          } else {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Join workshop'});
          }
          this.sanitizedOptions.isShowActions = true;
        }
        this.sanitized.people = <ServiceCardPeople>{};
        this.sanitized.people.people = this.data?.purchased?.map((u: UserDto): ServiceCardPerson => ({
          ...this.sanitized.owner,
          avatar: {src: u.profilePictureUrl},
          fullName: u.fullName
        }));
        this.sanitized.people.avatarStackCount = 3;
        this.sanitized.people.isShowAvatars = true;
        break;
      case 'broadcast':
        if (this.isCreator) {
          this.sanitizedOptions.isShowStatus = true;
          if (EventStatus.Draft === this.serviceStatus) {
            this.sanitized.status = <ServiceCardStatus>{type: 'draft', label: 'Draft', show: true};
          }
          if (this.isExpired) {
            this.sanitized.status = <ServiceCardStatus>{type: 'archived', label: 'Published', show: true};
          }
          if (this.isUpcoming && EventStatus.Draft !== this.serviceStatus) {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Join broadcast'});
            this.sanitized.status = <ServiceCardStatus>{type: 'published', label: 'Published', show: true};
            this.sanitizedOptions.isShowActions = true;
          }
        } else {
          this.sanitizedOptions.isShowStatus = false;
          if (this.isExpired) {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
          } else {
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Join broadcast'});
          }
          this.sanitizedOptions.isShowActions = true;
        }
        this.sanitized.people = <ServiceCardPeople>{};
        this.sanitized.people.people = this.data?.purchased?.map((u: UserDto): ServiceCardPerson => ({
          ...this.sanitized.owner,
          avatar: {src: u.profilePictureUrl},
          fullName: u.fullName
        }));
        this.sanitized.people.avatarStackCount = 3;
        this.sanitized.people.isShowAvatars = true;
        break;
      case 'coaching':
        this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
        this.sanitized.composition.sessions = 1;
        this.sanitized.composition.durationInSec = Math.floor(Math.random() * (10000 - 20) + 20);
        this.sanitized.people.isShowAvatars = false;
        if (this.isCreator) {
          if (this.isBooked) {
            this.sanitizedOptions.isShowActions = true;
            if (this.isExpired || this.isPast) {
              this.sanitizedOptions.isShowActions = !this.isBooking;
              if (this.hasReviewed) {
                this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'buy', label: 'Buy again'});
              } else {
                this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
              }
            } else if (this.isCancelled) {
              this.sanitizedOptions.isShowActions = !this.isBooking;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'buy', label: 'Buy again'});
            } else {
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Join session'});
            }
          } else {
            switch (this.serviceStatus) {
              case CoachingStatus.Archived:
                this.sanitized.status = <ServiceCardStatus>{type: 'archived', label: 'Archived', show: true};
                this.sanitizedOptions.isShowStatus = true;
                break;
              case CoachingStatus.Published:
                this.sanitized.status = <ServiceCardStatus>{type: 'published', label: 'Published', show: true};
                this.sanitizedOptions.isShowStatus = true;
                break;
              case CoachingStatus.Draft:
                this.sanitized.status = <ServiceCardStatus>{type: 'draft', label: 'Draft', show: true};
                this.sanitizedOptions.isShowStatus = true;
                break;
            }
          }
        } else {
          if (this.isBooked) {
            this.sanitizedOptions.isShowActions = true;
            this.sanitizedOptions.headingType = 'schedule';
            if (this.isExpired || this.isPast) {
              if (this.hasReviewed) {
                this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'buy', label: 'Buy again'});
              } else {
                this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
              }
            } else if (this.isCancelled) {
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'buy', label: 'Buy again'});
            } else {
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Join session'});
            }
          } else {
            this.sanitizedOptions.headingType = 'unbooked';
            this.sanitizedOptions.isShowQuickPreview = true;
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'book', label: 'Book a time'});
            this.sanitizedOptions.isShowActions = true;
          }
        }
        break;
      case 'course':
        if (this.isCreator) {
          switch (this.serviceStatus) {
            case CourseStatus.Archived:
              this.sanitized.status = <ServiceCardStatus>{type: 'archived', label: 'Archived', show: true};
              break;
            case CourseStatus.Published:
              this.sanitized.status = <ServiceCardStatus>{type: 'published', label: 'Published', show: true};
              break;
            case CourseStatus.Draft:
              this.sanitized.status = <ServiceCardStatus>{type: 'draft', label: 'Draft', show: true};
              break;
          }

          this.sanitized.people = <ServiceCardPeople>{};
          this.sanitized.people.people = this.data?.enrolled?.map((u: UserDto): ServiceCardPerson => ({
            ...this.sanitized.owner,
            avatar: {src: u.profilePictureUrl},
            fullName: u.fullName
          }));
          this.sanitized.people.avatarStackCount = 3;
          this.sanitized.people.isShowAvatars = true;
        } else {
          this.sanitized.people.isShowAvatars = false;
          this.sanitized.progress = this.data?.progress;
          this.sanitized.status = this.data?.progress < 100 ?
            <ServiceCardStatus>{type: 'read', label: this.currentLesson, show: true} :
            <ServiceCardStatus>{type: 'completed', label: 'Congratulations! You’ve finished this course', show: true};

          if (this.isCourseStarted) {
            this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Continue'});
          } else if (this.isCourseCompleted) {
            if (this.hasReviewed) {
              this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Start again'});
            } else {
              this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
            }
          } else {
            this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{type: 'join', label: 'Start course'});
          }
        }
        break;
      case 'event':
        break;
      case 'space':
        break;
      case 'tutorial':
        if (this.isCreator) {
          this.sanitized.composition = this.sanitized.composition ?? <ServiceCardComposition>{};
          this.sanitized.composition.videos = this.getRndInteger(1, 11);
          this.sanitized.composition.durationInSec = Math.floor(Math.random() * (3600 - 20) + 20);

          this.sanitizedOptions.isSHowPurchased = true;
          this.sanitized.people.isShowAvatars = false;
          switch (this.serviceStatus) {
            case ArticleStatus.Archived:
              this.sanitized.status = <ServiceCardStatus>{type: 'archived', label: 'Archived', show: true};
              break;
            case ArticleStatus.Published:
              this.sanitized.status = <ServiceCardStatus>{type: 'published', label: 'Published', show: true};
              break;
            case ArticleStatus.Draft:
              this.sanitized.status = <ServiceCardStatus>{type: 'draft', label: 'Draft', show: true};
              break;
          }
        } else {
          this.sanitized.people.isShowAvatars = false;
          const tempStatus = this.getRndInteger(1, 4);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{
                type: 'onprogress',
                label: 'Tutorial 1 - Start your new journey',
                show: true
              };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'play', label: 'Play Tutorial'});
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = 0;
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{
                type: 'onprogress',
                label: 'Tutorial 1 - Start your new journey',
                show: true
              };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'play', label: 'Continue'});
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = Math.floor(Math.random() * (100 - 1) + 1);
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{
                type: 'completed', label: this.l('FinishedTutorial', this.localizationSourceName), show: true
              };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'review', label: 'Leave review'});
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
            case 4:
              this.sanitized.status = <ServiceCardStatus>{
                type: 'completed', label: this.l('FinishedTutorial', this.localizationSourceName), show: true
              };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{type: 'play', label: 'Play again'});
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
          }
        }
        break;
    }
  }

  private setOptionOverrides(): void {
    switch (this.cardType) {
      case 'article':
        if (this.isCreator) {
          if (!this.options || !('isShowStatus' in this.options)) {
            this.sanitizedOptions.isShowStatus = true;
          }
          if (!this.options || !('isSHowPurchased' in this.options)) {
            this.sanitizedOptions.isSHowPurchased = true;
          }

          this.sanitized.people = <ServiceCardPeople>{};
          this.sanitized.people.people = this.data?.purchased?.map((u: UserDto): ServiceCardPerson => ({
            ...this.sanitized.owner,
            avatar: {src: u.profilePictureUrl},
            fullName: u.fullName
          }));
          this.sanitized.people.avatarStackCount = 3;
          this.sanitized.people.isShowAvatars = true;
        } else {
          if (!this.options || !('isShowActions' in this.options)) {
            this.sanitizedOptions.isShowActions = true;
          }
        }
        if (!this.options || !('isShowInfo' in this.options)) {
          this.sanitizedOptions.isShowInfo = true;
        }
        if (!this.options || !('isShowImages' in this.options)) {
          this.sanitizedOptions.isShowImages = false;
        }
        break;
      case 'broadcast':
        if (!this.options || !('isShowDate' in this.options)) {
          this.sanitizedOptions.isShowDate = true;
        }
        if (!this.options || !('isShowHeading' in this.options)) {
          this.sanitizedOptions.isShowHeading = true;
        }
        if (!this.options || !('headingType' in this.options)) {
          this.sanitizedOptions.headingType = 'schedule';
        }
        if (!this.options || !('isShowGoing' in this.options)) {
          this.sanitizedOptions.isShowGoing = true;
        }
        break;
      case 'workshop':
        if (!this.options || !('isShowDate' in this.options)) {
          this.sanitizedOptions.isShowDate = true;
        }
        if (!this.options || !('isShowHeading' in this.options)) {
          this.sanitizedOptions.isShowHeading = true;
        }
        if (!this.options || !('headingType' in this.options)) {
          this.sanitizedOptions.headingType = 'schedule';
        }
        if (!this.options || !('isShowGoing' in this.options)) {
          this.sanitizedOptions.isShowGoing = true;
        }
        break;
      case 'coaching':
        this.sanitizedOptions.isShowImages = true;
        if (this.isCreator) {
          if (this.isBooked) {
            if (!this.options || !('isShowHeading' in this.options)) {
              this.sanitizedOptions.isShowHeading = true;
            }
            if (!this.options || !('headingType' in this.options)) {
              this.sanitizedOptions.headingType = 'schedule';
            }
            if (!this.options || !('isShowMajorParticipants' in this.options)) {
              this.sanitizedOptions.isShowMajorParticipants = true;
            }
            if (!this.options || !('isShowCoachingDetails' in this.options)) {
              this.sanitizedOptions.isShowCoachingDetails = true;
            }
          } else {
            if (!this.options || !('isShowQuickPreview' in this.options)) {
              this.sanitizedOptions.isShowQuickPreview = true;
            }
            if (!this.options || !('isSHowPurchased' in this.options)) {
              this.sanitizedOptions.isSHowPurchased = true;
            }
          }
        } else {
          if (!this.options || !('isShowHeading' in this.options)) {
            this.sanitizedOptions.isShowHeading = true;
          }
          if (!this.options || !('isShowMajorParticipants' in this.options)) {
            this.sanitizedOptions.isShowMajorParticipants = true;
          }
          if (!this.options || !('isShowCoachingDetails' in this.options)) {
            this.sanitizedOptions.isShowCoachingDetails = true;
          }
        }

        break;
      case 'course':
        if (this.isCreator) {
          if (!this.options || !('isShowEnrolled' in this.options)) {
            this.sanitizedOptions.isShowEnrolled = true;
          }
          if (!this.options || !('isShowStatus' in this.options)) {
            this.sanitizedOptions.isShowStatus = true;
          }
          if (!this.options || !('isShowDetailsComposition' in this.options)) {
            this.sanitizedOptions.isShowDetailsComposition = true;
          }
        } else {
          if (!this.options || !('isShowProgress' in this.options)) {
            this.sanitizedOptions.isShowProgress = true;
          }
          if (!this.options || !('isShowActions' in this.options)) {
            this.sanitizedOptions.isShowActions = true;
          }
        }
        break;
      case 'event':
        if (!this.options || !('isShowGoing' in this.options)) {
          this.sanitizedOptions.isShowGoing = true;
        }
        break;
      case 'space':
        break;
      case 'tutorial':
        if (!this.options || !('isShowQuickPreview' in this.options)) {
          this.sanitizedOptions.isShowQuickPreview = true;
        }
        if (this.isCreator) {
          if (!this.options || !('isShowStatus' in this.options)) {
            this.sanitizedOptions.isShowStatus = true;
          }
          if (!this.options || !('isShowDetailsComposition' in this.options)) {
            this.sanitizedOptions.isShowDetailsComposition = true;
          }
          if (!this.options || !('isSHowPurchased' in this.options)) {
            this.sanitizedOptions.isSHowPurchased = true;
          }
          if (!this.options || !('isShowImages' in this.options)) {
            this.sanitizedOptions.isShowImages = true;
          }
        } else {
          if (!this.options || !('isShowDetails' in this.options)) {
            this.sanitizedOptions.isShowDetails = false;
          }
          if (!this.options || !('isShowProgress' in this.options)) {
            this.sanitizedOptions.isShowProgress = true;
          }
        }
        break;
    }
  }
}
