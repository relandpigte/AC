import { Component, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as humanizeDuration from 'humanize-duration';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

import { AppComponentBase } from '@shared/app-component-base';
import {
  DefaultServiceCardActions,
  DefaultServiceCardOptions,
  ServiceCard,
  ServiceCardButton,
  ServiceCardComposition,
  ServiceCardImage,
  ServiceCardOptions,
  ServiceCardPeople,
  ServiceCardPerson,
  ServiceCardStatus,
  ServiceCardType
} from '@shared/models/service-card.model';
import {
  ArticleStatus,
  ArticleType, CoachingStatus,
  CourseSectionType,
  CourseStatus,
  StudentCourseDto,
  UserDto
} from '@shared/service-proxies/service-proxies';
import localize = abp.localization.localize;


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

  @Input() additionalData: any = {};

  @Input() isOverview: boolean;

  @Output() onDelete: Subject<any> = new Subject<any>();
  @Output() onClickAction: Subject<any> = new Subject<any>();
  @Output() onReviewAction: Subject<any> = new Subject<any>();

  sanitized: ServiceCard;
  sanitizedOptions: ServiceCardOptions;
  sanitizedActions: ServiceCardButton[];

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(injector: Injector) {
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
  get learners(): number { return this.data?.enrolled?.length ?? 20; }
  get progress(): number | null {
    if (this.status?.type === 'completed') { return null; }
    return this.sanitized?.progress ?? 0;
  }
  get composition(): ServiceCardComposition { return this.sanitized?.composition; }
  get compositionString(): string {
    if (!this.composition) { return null; }
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
  get isDraft(): boolean { return this.sanitized?.status?.type === 'draft'; }
  get isArchive(): boolean { return this.sanitized?.status?.type === 'archived'; }
  get isExpired(): boolean { return this.sanitized?.dates?.startDate?.isBefore(moment()); }
  get hasReviewed(): boolean { return this.data?.isDoneRating; }
  get sessionDuration(): string { return humanizeDuration(this.composition.durationInSec * 1000); }
  get isScheduleNear(): boolean { return this.sanitized?.dates?.startDate?.diff(moment(), 'hours') < 1; }
  get schedule(): string {
    if (this.isDraft || !this.sanitized?.dates?.startDate) {
      return this.l('Unscheduled');
    }
    if (this.sanitized.dates.startDate.diff(moment(), 'minutes') < 1) {
      return this.l('LiveNow');
    } else if (this.sanitized.dates.startDate.diff(moment(), 'hours') < 1) {
      return this.l('StartingIn', this.convertMomentToDateAgo(this.sanitized.dates.startDate, true));
    }
    return this.l(
      'StartingFrom',
      this.sanitized.dates.startDate.format('dddd, DD MMMM YYYY'),
      this.sanitized.dates.startDate.format('HH:mm'),
      this.sanitized.dates.endDate.format('HH:mm')
    );
  }
  get scheduleDay(): string { return this.isDraft ? '--' : this.sanitized?.dates?.startDate?.format('DD'); }
  get scheduleMonth(): string { return this.isDraft ? '---' : this.sanitized?.dates?.startDate?.format('MMM'); }
  get isBooked(): boolean { return !!this.sanitized?.booking; }
  get coachingTutorFullName(): string { return this.sanitized.owner.fullName ?? 'Casey Fyfe'; }
  get coachingStudentFullName(): string { return this.sanitized?.booking?.student?.fullName ?? 'Casey Fyfe'; }
  get coachingStudentAvatarSrc(): string { return this.sanitized?.booking?.student?.avatar?.src ?? 'assets/img/anonymous.png'; }
  get coachingDuration(): string { return humanizeDuration(this.sanitized?.booking?.durationInSec ?? 60000); }

  get serviceStatus(): number { return this.data?.status; }
  get isCourseStarted(): boolean { return this.sanitized?.progress > 0 && this.sanitized?.progress < 100; }
  get isCourseCompleted(): boolean { return this.sanitized?.progress === 100; }
  get currentLesson(): string {
    if (this.isCourseCompleted) { return; }
    const courses = <StudentCourseDto>this.data?.studentCourses?.find((s: StudentCourseDto): boolean => s.progress < 100);
    let section = courses?.studentCourseSections?.find(s => s.status === 1)?.courseSection;
    if (courses?.progress === 0) {
      section = courses?.studentCourseSections[0]?.courseSection;
    }
    return `${CourseSectionType[section?.type]} - ${section?.name}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes && this.data) {
      const { options, service } = ServiceCardUtils.getSanitizeServiceData(this.data, {}, [], false);
      this.sanitized = service;
      this.sanitizedOptions = options;

      this.setInitValues();
    }
  }

  handleDelete(id: string): void {
    this.onDelete.next(id);
  }

  handleClickAction(serviceId: string, action: ServiceCardButton): void {
    switch (action.type) {
      case 'join':
        this.onClickAction.next(serviceId);
        break;
      case 'review':
        this.onReviewAction.next(serviceId);
        break;
    }
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
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              break;
            case ArticleStatus.Published:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              break;
            case ArticleStatus.Draft:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              break;
          }
        } else {
          const tempStatus = Math.floor(Math.random() * (4 - 1) + 1);
          switch (tempStatus) {
            case 1:
              this.sanitized.status = <ServiceCardStatus>{ type: 'unread', label: 'Unread', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'read', label: 'Read' });
              break;
            case 2:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'You’ve read this.', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'read', label: 'Read Again' });
              break;
            case 3:
              this.sanitized.status = <ServiceCardStatus>{ type: 'completed', label: 'You’ve read this', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              break;
          }
        }
        break;
      case 'broadcast':
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
        this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
        this.sanitized.composition.sessions = 1;
        this.sanitized.composition.durationInSec = Math.floor(Math.random() * (10000 - 20) + 20);

        if (this.isCreator) {
          if (this.isBooked) {
            if (!this.isExpired) {
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join session' });
              this.sanitizedOptions.isShowActions = true;
            }
          } else {
            switch (this.serviceStatus) {
              case CoachingStatus.Archived:
                this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
                this.sanitizedOptions.isShowStatus = true;
                break;
              case CoachingStatus.Published:
                this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
                this.sanitizedOptions.isShowStatus = true;
                break;
              case CoachingStatus.Draft:
                this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
                this.sanitizedOptions.isShowStatus = true;
                break;
            }
          }
        } else {
          if (this.isBooked) {
            this.sanitizedOptions.headingType = 'schedule';
            if (this.isExpired) {
                this.sanitizedOptions.isShowActions = true;
              if (this.hasReviewed) {
                this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'buy', label: 'Buy again' });
              } else {
                this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              }
            } else {
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Join workshop' });
              this.sanitizedOptions.isShowActions = true;
            }
          } else {
            this.sanitizedOptions.headingType = 'unbooked';
            this.sanitizedOptions.isShowQuickPreview = true;
            this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'book', label: 'Book a time' });
            this.sanitizedOptions.isShowActions = true;
          }
        }
        break;
      case 'course':
        if (this.isCreator) {
          switch (this.serviceStatus) {
            case CourseStatus.Archived:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              break;
            case CourseStatus.Published:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              break;
            case CourseStatus.Draft:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
              break;
          }

          this.sanitized.people = <ServiceCardPeople>{};
          this.sanitized.people.people = this.data?.enrolled?.map((u: UserDto): ServiceCardPerson => ({
            ...this.sanitized.owner,
            avatar: { src: u.profilePictureUrl },
            fullName: u.fullName
          }));
          this.sanitized.people.avatarStackCount = 3;
          this.sanitized.people.isShowAvatars = true;
        } else {
          this.sanitized.progress = this.data?.progress;
          this.sanitized.status = this.data?.progress < 100 ?
            <ServiceCardStatus>{ type: 'read', label: this.currentLesson, show: true } :
            <ServiceCardStatus>{ type: 'completed', label: 'Congratulations! You’ve finished this course', show: true };

          if (this.isCourseStarted) {
            this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Continue' });
          } else if (this.isCourseCompleted) {
            if (this.hasReviewed) {
              this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Start again' });
            } else {
              this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
            }
          } else {
            this.sanitizedActions?.splice(0, 0, <ServiceCardButton>{ type: 'join', label: 'Start course' });
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

          switch (this.serviceStatus) {
            case ArticleStatus.Archived:
              this.sanitized.status = <ServiceCardStatus>{ type: 'archived', label: 'Archived', show: true };
              break;
            case ArticleStatus.Published:
              this.sanitized.status = <ServiceCardStatus>{ type: 'published', label: 'Published', show: true };
              break;
            case ArticleStatus.Draft:
              this.sanitized.status = <ServiceCardStatus>{ type: 'draft', label: 'Draft', show: true };
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
              this.sanitized.status = <ServiceCardStatus>{
                type: 'completed', label: localize('FinishedTutorial', this.localizationSourceName), show: true
              };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'review', label: 'Leave review' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
            case 4:
              this.sanitized.status = <ServiceCardStatus>{
                type: 'completed', label: localize('FinishedTutorial', this.localizationSourceName), show: true
              };
              this.sanitizedOptions.isShowStatus = true;
              this.sanitizedActions.splice(0, 0, <ServiceCardButton>{ type: 'play', label: 'Play again' });
              this.sanitizedOptions.isShowActions = true;
              this.sanitized.progress = null;
              break;
          }
        }
        break;
      case 'workshop':
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
        }
        break;
    }
  }

  private setOptionOverrides(): void {
    switch (this.cardType) {
      case 'article':
        if (this.isCreator) {
          if (!this.options || !('isShowStatus' in this.options)) { this.sanitizedOptions.isShowStatus = true; }
          if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isSHowPurchased = true; }
        } else {
          if (!this.options || !('isShowActions' in this.options)) { this.sanitizedOptions.isShowActions = true; }
        }
        if (!this.options || !('isShowInfo' in this.options)) { this.sanitizedOptions.isShowInfo = true; }
        break;
      case 'broadcast':
        if (!this.options || !('isShowEnrolled' in this.options)) { this.sanitizedOptions.isShowEnrolled = true; }
        if (!this.options || !('isShowDate' in this.options)) { this.sanitizedOptions.isShowDate = true; }
        if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
        if (!this.options || !('headingType' in this.options)) { this.sanitizedOptions.headingType = 'schedule'; }
        if (!this.options || !('isShowGoing' in this.options)) { this.sanitizedOptions.isShowGoing = true; }
        break;
      case 'coaching':
        if (this.isCreator) {
          if (this.isBooked) {
            if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
            if (!this.options || !('headingType' in this.options)) { this.sanitizedOptions.headingType = 'schedule'; }
            if (!this.options || !('isShowMajorParticipants' in this.options)) { this.sanitizedOptions.isShowMajorParticipants = true; }
            if (!this.options || !('isShowCoachingDetails' in this.options)) { this.sanitizedOptions.isShowCoachingDetails = true; }
          } else {
            if (!this.options || !('isShowQuickPreview' in this.options)) { this.sanitizedOptions.isShowQuickPreview = true; }
            if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isSHowPurchased = true; }
          }
        } else {
          if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
          if (!this.options || !('isShowMajorParticipants' in this.options)) { this.sanitizedOptions.isShowMajorParticipants = true; }
          if (!this.options || !('isShowCoachingDetails' in this.options)) { this.sanitizedOptions.isShowCoachingDetails = true; }
        }

        break;
      case 'course':
        if (this.isCreator) {
          if (!this.options || !('isShowEnrolled' in this.options)) { this.sanitizedOptions.isShowEnrolled = true; }
          if (!this.options || !('isShowStatus' in this.options)) { this.sanitizedOptions.isShowStatus = true; }
          if (!this.options || !('isShowDetailsComposition' in this.options)) { this.sanitizedOptions.isShowDetailsComposition = true; }
        } else {
          if (!this.options || !('isShowProgress' in this.options)) { this.sanitizedOptions.isShowProgress = true; }
          if (!this.options || !('isShowActions' in this.options)) { this.sanitizedOptions.isShowActions = true; }
        }
        break;
      case 'event':
        break;
      case 'space':
        break;
      case 'tutorial':
        if (!this.options || !('isShowQuickPreview' in this.options)) { this.sanitizedOptions.isShowQuickPreview = true; }
        if (this.isCreator) {
          if (!this.options || !('isShowStatus' in this.options)) { this.sanitizedOptions.isShowStatus = true; }
          if (!this.options || !('isShowDetailsComposition' in this.options)) { this.sanitizedOptions.isShowDetailsComposition = true; }
          if (!this.options || !('isSHowPurchased' in this.options)) { this.sanitizedOptions.isSHowPurchased = true; }
          if (!this.options || !('isShowImages' in this.options)) { this.sanitizedOptions.isShowImages = true; }
        } else {
          if (!this.options || !('isShowDetails' in this.options)) { this.sanitizedOptions.isShowDetails = false; }
          if (!this.options || !('isShowProgress' in this.options)) { this.sanitizedOptions.isShowProgress = true; }
        }
        break;
      case 'workshop':
        if (!this.options || !('headingType' in this.options)) { this.sanitizedOptions.headingType = 'schedule'; }
        if (!this.options || !('isShowDate' in this.options)) { this.sanitizedOptions.isShowDate = true; }
        if (!this.options || !('isShowHeading' in this.options)) { this.sanitizedOptions.isShowHeading = true; }
        if (!this.options || !('isShowGoing' in this.options)) { this.sanitizedOptions.isShowGoing = true; }
        break;
    }
  }
}
