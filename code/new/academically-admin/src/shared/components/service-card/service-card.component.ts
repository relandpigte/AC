import { VideoType } from './../../service-proxies/service-proxies';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DefaultServiceCardActions, DefaultServiceCardOptions, ServiceCard, ServiceCardButton, ServiceCardComposition, ServiceCardDates, ServiceCardImage, ServiceCardOptions, ServiceCardPeople, ServiceCardPerson, ServiceCardPill, ServiceCardPrice, ServiceCardReview, ServiceCardRsvp, ServiceCardSlots, ServiceCardType, UserServiceCardActions } from '@shared/models/service-card.model';
import { ArticleDto, CoachingDto, CourseDto, EventDto, UserDto, VideoDto, WorkshopDto } from '@shared/service-proxies/service-proxies';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.less']
  })
  export class ServiceCardComponent extends AppComponentBase implements OnInit {
    @Input() isLoading: boolean;
    @Input() isFeatured: boolean;
    @Input() options: ServiceCardOptions;
    @Input() data: any;
    @Input() actions: ServiceCardButton[];

    shimmerType: number = 0;

    sanitized: ServiceCard;
    sanitizedOptions: ServiceCardOptions;
    sanitizedActions: ServiceCardButton[];

    constructor(
        injector: Injector
    ) {
        super(injector)
    }

    ngOnInit(): void {
      this.sanitizeData();
      this.setShimmerType();
    }

    get type(): ServiceCardType { return this.sanitized?.type ?? 'course'; }
    get images(): ServiceCardImage[] { return this.sanitized?.images; }
    get name(): string { return this.sanitized?.name; }
    get info(): string { return this.sanitized?.info; }
    get description(): string { return this.sanitized?.description; }
    get pillClass(): string { return this.sanitized?.pill?.class ?? ''; }
    get pillLabel(): string { return this.isFeatured ? 'feature' : this.sanitized?.pill?.label ?? ''; }
    get location(): string { return this.sanitized?.location ?? null; }
    get schedule(): string {
      if (!this.sanitized?.dates?.startDate) return null;
      if (this.sanitized.dates.startDate.diff(moment(), 'minutes') < 1) return this.l('LiveNow');
      return  this.l('ToStart', this.convertMomentToDateAgo(this.sanitized.dates.startDate, true));
    }
    get startDate(): moment.Moment { return this.sanitized?.dates?.startDate; }
    get progress(): number { return this.sanitized?.progress ?? 0; }
    get priceValue(): number { return this.sanitized?.price?.price ?? 0; }
    get priceCurrency(): string { return this.sanitized?.price?.currency ?? 'GBP'; }
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

    private getCardType(): ServiceCardType {
      if (this.data instanceof EventDto) return 'event';
      else if (this.data instanceof ArticleDto) return 'article';
      else if (this.data instanceof CoachingDto) return 'coaching';
      else if (this.data instanceof CourseDto) return 'course';
      else if (this.data instanceof WorkshopDto) return 'workshop';
      else if (this.data instanceof VideoDto) return 'tutorial';
      else if (this.data instanceof UserDto) return 'user';
      return 'space';
    }

    private setShimmerType(): void {
      if (this.isFeatured) {
        this.shimmerType = 1;
        return;
      }
      switch(this.type) {
        case 'article':
          this.shimmerType = 1;
          break;
        case 'user':
          this.shimmerType = 2;
          break;
        default:
          this.shimmerType = 0;
      }
    }

    private sanitizeData(): void {
      this.sanitizedOptions = _.merge({}, DefaultServiceCardOptions, this.options);

      this.sanitized = {} as ServiceCard;

      this.sanitized.type = this.getCardType();
      this.sanitized.images = [{ src: this.data.thumbnailImageUrl ?? 'assets/img/img-placeholder.png' }];
      this.sanitized.name = this.data?.name;
      this.sanitized.info = this.data?.description ?? this.data?.about;
      this.sanitized.description = this.data?.description;
      this.sanitized.location = this.data?.location;

      this.sanitized.pill = {} as ServiceCardPill;
      this.sanitized.pill.label =  this.sanitized.pill.label ?? this.sanitized.type;

      this.sanitized.dates = {} as ServiceCardDates;
      this.sanitized.dates.startDate = this.data.eventDateTime ?? this.data.workshopDateTime;
      this.sanitized.dates.endDate = this.data.endDate;

      this.sanitized.price = {} as ServiceCardPrice;
      this.sanitized.price.price = this.data?.price ?? 0;

      this.sanitized.owner = {} as ServiceCardPerson;
      this.sanitized.owner.avatar = {} as ServiceCardImage;
      this.sanitized.owner.avatar.src = this.data?.creatorUser?.profilePictureUrl ?? this.data.profilePictureUrl ?? 'assets/img/avatar-placeholder.png';
      this.sanitized.owner.fullName = this.data?.creatorUser?.fullName?? this.data.fullName ??  'Anonymous';
      this.sanitized.owner.isShowAvatar = true;
      this.sanitized.owner.isShowFullName = true;

      this.sanitizedActions = _.merge([], this.type === 'user' ? UserServiceCardActions : DefaultServiceCardActions, this.actions);

      this.setValueOverrides();
      this.setOptionOverrides();
      this.setTempValues();
    }

    private setValueOverrides(): void {
      switch(this.sanitized?.type) {
        case 'article':
          this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
          // if (this.data?.articlesCount) {
            console.log('ARTICLES COUNT ---->', this.data?.articlesCount);
            this.sanitized.composition.articles = this.data?.articlesCount;
          // }

          this.sanitizedActions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
          break;

        case 'broadcast':
          break;

        case 'coaching':
          this.sanitized.owner.isBannerAvatar = true;
          this.sanitizedActions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
          break;

        case 'course':
          this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
          this.sanitized.composition.modules = this.data?.modules;
          this.sanitized.composition.lessons = this.data?.lessons;
          this.sanitized.progress = this.data?.progress > 0 ? this.data?.progress : undefined;
          this.sanitized.people = {} as ServiceCardPeople;
          this.sanitized.people.people = Array(this.randomNonZero(45, 12)).fill({} as ServiceCardPerson).map(i => ({ ...this.sanitized.owner, avatar: { src: `https://i.pravatar.cc/300?u=${this.uuidv4()}`} }));
          this.sanitized.people.avatarStackCount = 5;
          this.sanitized.people.isShowAvatars = true;
          this.sanitized.people.isShowCount = true;

          this.sanitizedActions.splice(0, 0, { type: 'submit', action: 'enroll', label: 'Enroll', class: 'btn-primary' } as ServiceCardButton);
          break;

        case 'event':
          this.sanitizedActions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
          break;

        case 'space':
          this.sanitized.people = {} as ServiceCardPeople;
          this.sanitized.people.people = Array(this.randomNonZero(45, 12)).fill({} as ServiceCardPerson).map(i => ({ ...this.sanitized.owner, avatar: { src: `https://i.pravatar.cc/300?u=${this.uuidv4()}`} }));
          this.sanitized.people.avatarStackCount = 5;
          this.sanitized.people.isShowAvatars = true;
          this.sanitized.people.isShowCount = true;

          this.sanitizedActions.splice(0, 0, { type: 'submit', action: 'subscribe', label: 'Subscribe', class: 'btn-primary' } as ServiceCardButton);
          break;

        case 'tutorial':
          this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
          this.sanitized.composition.videos = this.data?.videoCount;
          this.sanitized.composition.durationInSec = this.data?.videoLength;

          this.sanitizedActions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
          break;

        case 'user':
          this.sanitized.owner.isBannerAvatar = true;
          this.sanitized.owner.isShowFullName = false;
          break;

        case 'workshop':
          this.sanitized.slots = { left: this.randomNonZero(23, 2) } as ServiceCardSlots;

          this.sanitized.composition = this.sanitized.composition ?? {} as ServiceCardComposition;
          this.sanitized.composition.workshops = 5;

          this.sanitized.rsvp = this.sanitized.rsvp ?? {} as ServiceCardRsvp;
          this.sanitized.rsvp.going = 8;
          this.sanitized.rsvp.interested = 15;

          this.sanitizedActions.splice(0, 0,
            {
              type: 'group',
              label: 'RSVP',
              class: 'btn-primary',
              buttons: [
                { type: 'submit', action: 'interested', label: 'Interested' } as ServiceCardButton,
                { type: 'submit', action: 'going', label: 'Going' } as ServiceCardButton
              ]
            } as ServiceCardButton
          );
          break;
      }

      if (this.isFeatured) {
        this.sanitized.people = null;
        this.sanitizedActions = null;
      }
    }

    private setOptionOverrides(): void {
      switch(this.sanitized?.type) {
        case 'article':
          if (!this.options || !('isShowImages' in this.options)) this.sanitizedOptions.isShowImages = false;
          if (!this.options || !('isShowHeading' in this.options)) this.sanitizedOptions.isShowHeading = false;
          if (!this.options || !('isShowDescription' in this.options)) this.sanitizedOptions.isShowDescription = true;
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if ((!this.options || !('isShowDetailsComposition' in this.options)) && this.sanitized.composition.articles > 0) this.sanitizedOptions.isShowDetailsComposition = true;
          if (!this.options || !('isShowDetailsReviews' in this.options)) this.sanitizedOptions.isShowDetailsReviews = true;
          break;

        case 'broadcast':
          if (!this.options || !('headingType' in this.options)) this.sanitizedOptions.headingType = 'schedule';
          if (!this.options || !('isShowCalendarCard' in this.options)) this.sanitizedOptions.isShowCalendarCard = true;
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsComposition' in this.options)) this.sanitizedOptions.isShowDetailsComposition = true;
          if (!this.options || !('isShowDetailsRsvp' in this.options)) this.sanitizedOptions.isShowDetailsRsvp = true;
          break;

        case 'coaching':
          if (!this.options || !('isShowHeading' in this.options)) this.sanitizedOptions.isShowHeading = false;
          if (!this.options || !('isShowInfo' in this.options)) this.sanitizedOptions.isShowInfo = true;
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsComposition' in this.options)) this.sanitizedOptions.isShowDetailsComposition = true;
          if (!this.options || !('isShowDetailsReviews' in this.options)) this.sanitizedOptions.isShowDetailsReviews = true;
          break;

        case 'course':
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsComposition' in this.options)) this.sanitizedOptions.isShowDetailsComposition = true;
          if (!this.options || !('isShowDetailsReviews' in this.options)) this.sanitizedOptions.isShowDetailsReviews = true;
          if (!this.options || !('isDetailsReviewsSeparated' in this.options)) this.sanitizedOptions.isDetailsReviewsSeparated = true;
          if ((!this.options || !('isShowProgress' in this.options)) && this.sanitized?.progress > 0) this.sanitizedOptions.isShowProgress = true;
          break;

        case 'event':
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsComposition' in this.options)) this.sanitizedOptions.isShowDetailsComposition = true;
          if (!this.options || !('isShowDetailsLastActive' in this.options)) this.sanitizedOptions.isShowDetailsLastActive = true;
          break;

        case 'space':
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsLastActive' in this.options)) this.sanitizedOptions.isShowDetailsLastActive = true;
          if (!this.options || !('isShowHeading' in this.options)) this.sanitizedOptions.isShowHeading = false;
          break;

        case 'tutorial':
          if (!this.options || !('isShowQuickPreview' in this.options)) {
            this.sanitizedOptions.isShowQuickPreview = this.sanitized.composition.videos > 1 ? true : false;
          }
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsReviews' in this.options)) this.sanitizedOptions.isShowDetailsReviews = true;
          if (!this.options || !('isShowHeading' in this.options)) this.sanitizedOptions.isShowHeading = false;
          break;

        case 'user':
          if (!this.options || !('isShowImages' in this.options)) this.sanitizedOptions.isShowImages = false;
          if (!this.options || !('isShowPill' in this.options)) this.sanitizedOptions.isShowPill = false;
          if (!this.options || !('isShowInfo' in this.options)) this.sanitizedOptions.isShowInfo = true;
          if (!this.options || !('isShowHeading' in this.options)) this.sanitizedOptions.isShowHeading = false;
          if (!this.options || !('isShowCalendarCard' in this.options)) this.sanitizedOptions.isShowCalendarCard = false;
          if (!this.options || !('isShowDescription' in this.options)) this.sanitizedOptions.isShowDescription = false;
          if (!this.options || !('isShowQuickPreview' in this.options)) this.sanitizedOptions.isShowQuickPreview = false;
          if (!this.options || !('isShowProgress' in this.options)) this.sanitizedOptions.isShowProgress = false;
          if (!this.options || !('isShowDetails' in this.options)) this.sanitizedOptions.isShowDetails = false;
          break;

        case 'workshop':
          if (!this.options || !('isShowHeadingSlots' in this.options)) this.sanitizedOptions.isShowHeadingSlots = true;
          if (!this.options || !('headingType' in this.options)) this.sanitizedOptions.headingType = 'schedule';
          if (!this.options || !('isShowCalendarCard' in this.options)) this.sanitizedOptions.isShowCalendarCard = true;
          if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
          if (!this.options || !('isShowDetailsComposition' in this.options)) this.sanitizedOptions.isShowDetailsComposition = true;
          if (!this.options || !('isShowDetailsRsvp' in this.options)) this.sanitizedOptions.isShowDetailsRsvp = true;
          break;
      }

      if (this.isFeatured) {
        if (!this.options || !('isShowImages' in this.options)) this.sanitizedOptions.isShowImages = false;
        if (!this.options || !('isShowHeading' in this.options)) this.sanitizedOptions.isShowHeading = false;
        if (!this.options || !('isShowHeadingSlots' in this.options)) this.sanitizedOptions.isShowHeadingSlots = false;
        if (!this.options || !('isShowInfo' in this.options)) this.sanitizedOptions.isShowInfo = false;
        if (!this.options || !('isShowDescription' in this.options)) this.sanitizedOptions.isShowDescription = false;
        if (!this.options || !('isShowDetailsPrice' in this.options)) this.sanitizedOptions.isShowDetailsPrice = true;
        if (!this.options || !('isShowDetailsComposition' in this.options)) this.sanitizedOptions.isShowDetailsComposition = true;
        if (!this.options || !('isShowDetailsReviews' in this.options)) this.sanitizedOptions.isShowDetailsReviews = true;
        if (!this.options || !('isShowDetailsSlots' in this.options)) this.sanitizedOptions.isShowDetailsSlots = true;
        if (!this.options || !('isShowDetailsRsvp' in this.options)) this.sanitizedOptions.isShowDetailsRsvp = false;
        if (!this.options || !('isDetailsReviewsSeparated' in this.options)) this.sanitizedOptions.isDetailsReviewsSeparated = false;
        if (!this.options || !('isShowActions' in this.options)) this.sanitizedOptions.isShowActions = false;
      }
    }

    private setTempValues(): void {
      if (!this.sanitized) return;
      if (this.isFeatured) {
        this.sanitized.images = Array(this.randomNonZero(4, 1)).fill({} as ServiceCardImage).map(i => ({...i, src: `https://picsum.photos/500`}));
      }

      if (!this.sanitized.reviews) this.sanitized.reviews = { value: 5, hasStar: true, count: 253 } as ServiceCardReview;
      // if (this.sanitized?.type === 'course' && !this.isFeatured && this.randomNonZero(10) % 2 === 0) {
      //   this.sanitized.progress = this.randomNonZero(100);
      //   if (!this.options || !('isShowProgress' in this.options)) this.sanitizedOptions.isShowProgress = true;
      //   if (!this.options || !('isShowDetails' in this.options)) this.sanitizedOptions.isShowDetails = false;
      // }
    }
  }
