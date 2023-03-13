import { DefaultServiceCardActions, DefaultServiceCardOptions, ServiceCard, ServiceCardDates, ServiceCardType, ServiceCardButton, ServiceCardImage, ServiceCardOptions, ServiceCardPerson, ServiceCardPill, ServiceCardPrice, UserServiceCardActions, ServiceCardComposition, ServiceCardPeople, ServiceCardSlots, ServiceCardRsvp } from '@shared/models/service-card.model';
import { ArticleDto, CoachingDto, CourseDto, EventCategory, EventDto, ServicesType, UserDto, VideoDto } from '@shared/service-proxies/service-proxies';

import * as _ from 'lodash';
import { Utils } from './utils';

export class ServiceCardUtils {

    static getCardType(data: any): ServiceCardType {
      if (data.serviceType) {
        return Object.keys(ServicesType).find(k => ServicesType[k] === data.serviceType).toLowerCase() as ServiceCardType;
      } else {
        if (data instanceof EventDto) {
          const d = data as EventDto;
          if (d.category === EventCategory.Broadcast) return 'broadcast';
          return 'workshop';
        }
        else if (data instanceof ArticleDto) return 'article';
        else if (data instanceof CoachingDto) return 'coaching';
        else if (data instanceof CourseDto) return 'course';
        else if (data instanceof VideoDto) return 'tutorial';
        else if (data instanceof UserDto) return 'user';
        return null;
      }
    }

    static getSanitizeServiceData(data: any, options: ServiceCardOptions, actions: ServiceCardButton[], isFeatured = false):
        { options: ServiceCardOptions, service: ServiceCard, actions: ServiceCardButton[] } {
        let sanitizedOptions = _.merge({}, DefaultServiceCardOptions, options);
        let sanitizedService = {} as ServiceCard;

        sanitizedService.type = ServiceCardUtils.getCardType(data);
        sanitizedService.images = [{ src: data.thumbnailImageUrl ?? 'assets/img/img-placeholder.png' }];
        sanitizedService.name = data?.name;
        sanitizedService.info = data?.description ?? data?.about;
        sanitizedService.description = data?.description;
        sanitizedService.location = data?.location;

        sanitizedService.pill = {} as ServiceCardPill;
        sanitizedService.pill.label =  sanitizedService.pill.label ?? sanitizedService.type;

        sanitizedService.dates = {} as ServiceCardDates;
        sanitizedService.dates.startDate = data.eventDateTime ?? data.workshopDateTime;
        sanitizedService.dates.endDate = data.endDate;

        sanitizedService.price = {} as ServiceCardPrice;
        sanitizedService.price.price = data?.price ?? 0;

        sanitizedService.owner = {} as ServiceCardPerson;
        sanitizedService.owner.avatar = {} as ServiceCardImage;
        sanitizedService.owner.avatar.src = data?.creatorUser?.profilePictureUrl ?? data.profilePictureUrl ?? 'assets/img/anonymous.png';
        sanitizedService.owner.fullName = data?.creatorUser?.fullName?? data.fullName ??  'Anonymous';
        sanitizedService.owner.isShowAvatar = true;
        sanitizedService.owner.isShowFullName = true;

        let sanitizedActions = _.merge([], sanitizedService.type === 'user' ? UserServiceCardActions : DefaultServiceCardActions, actions);

        ServiceCardUtils.overrideServiceValues(data, sanitizedService, sanitizedOptions, sanitizedActions, isFeatured);
        ServiceCardUtils.overrideServiceOptions(sanitizedService, options, sanitizedOptions, isFeatured);

        return { options: sanitizedOptions, service: sanitizedService, actions: sanitizedActions};
    }

    static overrideServiceValues(data: any, service: ServiceCard, options: ServiceCardOptions, actions: ServiceCardButton[], isFeatured = false): void {
        switch(service?.type) {
          case 'article':
            service.composition = service.composition ?? {} as ServiceCardComposition;
            // if (data?.articlesCount) {
              console.log('ARTICLES COUNT ---->', data?.articlesCount);
              service.composition.articles = data?.articlesCount;
            // }

            actions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'broadcast':
            actions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'coaching':
            service.owner.isBannerAvatar = true;
            actions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'course':
            service.composition = service.composition ?? {} as ServiceCardComposition;
            service.composition.modules = data?.modules;
            service.composition.lessons = data?.lessons;

            if (data?.progress) {
              service.progress = data.progress;
              options.isShowDetails = false; // turn off all course details, show only progress
            }

            service.people = {} as ServiceCardPeople;
            service.people.people = Array(Utils.randomNonZero(45, 12)).fill({} as ServiceCardPerson).map(i => ({ ...service.owner, avatar: { src: `https://i.pravatar.cc/300?u=${Utils.uuidv4()}`} }));
            service.people.avatarStackCount = 5;
            service.people.isShowAvatars = true;
            service.people.isShowCount = true;

            actions.splice(0, 0, { type: 'submit', action: 'enroll', label: 'Enroll', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'event':
            actions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'space':
            service.people = {} as ServiceCardPeople;
            service.people.people = Array(Utils.randomNonZero(45, 12)).fill({} as ServiceCardPerson).map(i => ({ ...service.owner, avatar: { src: `https://i.pravatar.cc/300?u=${Utils.uuidv4()}`} }));
            service.people.avatarStackCount = 5;
            service.people.isShowAvatars = true;
            service.people.isShowCount = true;

            actions.splice(0, 0, { type: 'submit', action: 'subscribe', label: 'Subscribe', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'tutorial':
            service.composition = service.composition ?? {} as ServiceCardComposition;
            service.composition.videos = data?.videoCount;
            service.composition.durationInSec = data?.videoLength;

            actions.splice(0, 0, { type: 'submit', action: 'purchase', label: 'Purchase', class: 'btn-primary' } as ServiceCardButton);
            break;

          case 'user':
            service.owner.isBannerAvatar = true;
            service.owner.isShowFullName = false;
            break;

          case 'workshop':
            service.slots = { left: Utils.randomNonZero(23, 2) } as ServiceCardSlots;

            service.composition = service.composition ?? {} as ServiceCardComposition;
            service.composition.workshops = 5;

            service.rsvp = service.rsvp ?? {} as ServiceCardRsvp;
            service.rsvp.going = 8;
            service.rsvp.interested = 15;

            actions.splice(0, 0,
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

        if (isFeatured) {
            service.people = null;
            actions = null;
        }
      }

      static overrideServiceOptions(service: ServiceCard, options: ServiceCardOptions, sanitizedOptions: ServiceCardOptions, isFeatured = false): void {
        switch(service?.type) {
          case 'article':
            if (!options || !('isShowImages' in options)) sanitizedOptions.isShowImages = false;
            if (!options || !('isShowHeading' in options)) sanitizedOptions.isShowHeading = false;
            if (!options || !('isShowDescription' in options)) sanitizedOptions.isShowDescription = true;
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if ((!options || !('isShowDetailsComposition' in options)) && service.composition.articles > 0) sanitizedOptions.isShowDetailsComposition = true;
            if (!options || !('isShowDetailsReviews' in options)) sanitizedOptions.isShowDetailsReviews = true;
            break;

          case 'broadcast':
            if (!options || !('headingType' in options)) sanitizedOptions.headingType = 'schedule';
            if (!options || !('isShowCalendarCard' in options)) sanitizedOptions.isShowCalendarCard = true;
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsComposition' in options)) sanitizedOptions.isShowDetailsComposition = true;
            if (!options || !('isShowDetailsRsvp' in options)) sanitizedOptions.isShowDetailsRsvp = true;
            break;

          case 'coaching':
            if (!options || !('isShowHeading' in options)) sanitizedOptions.isShowHeading = false;
            if (!options || !('isShowInfo' in options)) sanitizedOptions.isShowInfo = true;
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsComposition' in options)) sanitizedOptions.isShowDetailsComposition = true;
            if (!options || !('isShowDetailsReviews' in options)) sanitizedOptions.isShowDetailsReviews = true;
            break;

          case 'course':
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsComposition' in options)) sanitizedOptions.isShowDetailsComposition = true;
            if (!options || !('isShowDetailsReviews' in options)) sanitizedOptions.isShowDetailsReviews = true;
            if (!options || !('isDetailsReviewsSeparated' in options)) sanitizedOptions.isDetailsReviewsSeparated = true;
            if ((!options || !('isShowProgress' in options)) && service?.progress > 0) sanitizedOptions.isShowProgress = true;
            break;

          case 'event':
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsComposition' in options)) sanitizedOptions.isShowDetailsComposition = true;
            if (!options || !('isShowDetailsLastActive' in options)) sanitizedOptions.isShowDetailsLastActive = true;
            break;

          case 'space':
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsLastActive' in options)) sanitizedOptions.isShowDetailsLastActive = true;
            if (!options || !('isShowHeading' in options)) sanitizedOptions.isShowHeading = false;
            break;

          case 'tutorial':
            if (!options || !('isShowQuickPreview' in options)) {
              options.isShowQuickPreview = service.composition.videos > 1 ? true : false;
            }
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsReviews' in options)) sanitizedOptions.isShowDetailsReviews = true;
            if (!options || !('isShowHeading' in options)) sanitizedOptions.isShowHeading = false;
            break;

          case 'user':
            if (!options || !('isShowImages' in options)) sanitizedOptions.isShowImages = false;
            if (!options || !('isShowPill' in options)) sanitizedOptions.isShowPill = false;
            if (!options || !('isShowInfo' in options)) sanitizedOptions.isShowInfo = true;
            if (!options || !('isShowHeading' in options)) sanitizedOptions.isShowHeading = false;
            if (!options || !('isShowCalendarCard' in options)) sanitizedOptions.isShowCalendarCard = false;
            if (!options || !('isShowDescription' in options)) sanitizedOptions.isShowDescription = false;
            if (!options || !('isShowQuickPreview' in options)) sanitizedOptions.isShowQuickPreview = false;
            if (!options || !('isShowProgress' in options)) sanitizedOptions.isShowProgress = false;
            if (!options || !('isShowDetails' in options)) sanitizedOptions.isShowDetails = false;
            break;

          case 'workshop':
            if (!options || !('isShowHeadingSlots' in options)) sanitizedOptions.isShowHeadingSlots = true;
            if (!options || !('headingType' in options)) sanitizedOptions.headingType = 'schedule';
            if (!options || !('isShowCalendarCard' in options)) sanitizedOptions.isShowCalendarCard = true;
            if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
            if (!options || !('isShowDetailsComposition' in options)) sanitizedOptions.isShowDetailsComposition = true;
            if (!options || !('isShowDetailsRsvp' in options)) sanitizedOptions.isShowDetailsRsvp = true;
            break;
        }

        if (isFeatured) {
          if (!options || !('isShowImages' in options)) sanitizedOptions.isShowImages = false;
          if (!options || !('isShowHeading' in options)) sanitizedOptions.isShowHeading = false;
          if (!options || !('isShowHeadingSlots' in options)) sanitizedOptions.isShowHeadingSlots = false;
          if (!options || !('isShowInfo' in options)) sanitizedOptions.isShowInfo = false;
          if (!options || !('isShowDescription' in options)) sanitizedOptions.isShowDescription = false;
          if (!options || !('isShowDetailsPrice' in options)) sanitizedOptions.isShowDetailsPrice = true;
          if (!options || !('isShowDetailsComposition' in options)) sanitizedOptions.isShowDetailsComposition = true;
          if (!options || !('isShowDetailsReviews' in options)) sanitizedOptions.isShowDetailsReviews = true;
          if (!options || !('isShowDetailsSlots' in options)) sanitizedOptions.isShowDetailsSlots = true;
          if (!options || !('isShowDetailsRsvp' in options)) sanitizedOptions.isShowDetailsRsvp = false;
          if (!options || !('isDetailsReviewsSeparated' in options)) sanitizedOptions.isDetailsReviewsSeparated = false;
          if (!options || !('isShowActions' in options)) sanitizedOptions.isShowActions = false;
        }
    }
}
