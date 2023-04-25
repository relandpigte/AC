import * as moment from 'moment';

export interface ServiceCard {
    type: ServiceCardType;
    name?: string;
    info?: string;
    description?: string;
    location?: string;

    owner: ServiceCardPerson;
    people?: ServiceCardPeople;

    progress?: number;
    images?: ServiceCardImage[];
    pill?: ServiceCardPill;
    dates?: ServiceCardDates;
    slots?: ServiceCardSlots;
    price?: ServiceCardPrice;
    composition?: ServiceCardComposition;
    reviews?: ServiceCardReview;
    rsvp?: ServiceCardRsvp;
}

export interface ServiceCardOptions {
    isShowImages?: boolean;
    isShowPill?: boolean;
    isShowInfo?: boolean;
    isShowHeading?: boolean;
    isShowHeadingSlots?: boolean;
    isShowCalendarCard?: boolean;
    headingType?: HeadingType;
    isShowDescription?: boolean;
    isShowQuickPreview?: boolean;
    isShowProgress?: boolean,
    isShowDetails?: boolean;
    isShowDetailsPrice?: boolean;
    isShowDetailsComposition?: boolean;
    isShowDetailsLastActive?: boolean;
    isShowDetailsSlots?: boolean;
    isShowDetailsRsvp?: boolean;
    isShowDetailsReviews?: boolean;
    isDetailsReviewsSeparated?: boolean;
    isShowActions?: boolean;
}

export const DefaultServiceCardOptions: ServiceCardOptions = {
    isShowImages: true,
    isShowPill: true,
    isShowInfo: false,
    isShowHeading: true,
    isShowHeadingSlots: false,
    isShowCalendarCard: false,
    headingType: 'location',
    isShowDescription: false,
    isShowQuickPreview: false,
    isShowProgress: false,
    isShowDetails: true,
    isShowDetailsPrice: false,
    isShowDetailsComposition: false,
    isShowDetailsLastActive: false,
    isShowDetailsSlots: false,
    isShowDetailsRsvp: false,
    isShowDetailsReviews: false,
    isDetailsReviewsSeparated: false,
    isShowActions: true
}

export const DefaultServiceCardActions: ServiceCardButton[] = [
    { type: 'submit', action: 'save', label: 'Save', class: 'btn-light' },
    { type: 'share', action: 'share', class: 'btn-light' }
];

export const UserServiceCardActions: ServiceCardButton[] = [
    { type: 'follow', action: 'follow', label: 'Follow', class: 'btn-primary' },
    { type: 'submit', action: 'remove', label: 'Remove', class: 'btn-light' }
];

export type ServiceCardType = 'course' | 'tutorial' | 'article' | 'event' | 'broadcast' | 'coaching' | 'workshop' | 'user' | 'space' | 'feature';
export type ServiceCardButtonType = 'submit' | 'group' | 'share' | 'follow';
export type HeadingType = 'location' | 'schedule';

export interface ServiceCardPerson {
    avatar?: ServiceCardImage;
    fullName?: string;
    isShowAvatar?: boolean;
    isShowFullName?: boolean;
    isBannerAvatar?: boolean;
}

export interface ServiceCardPeople {
    people: ServiceCardPerson[];
    isShowCount?: boolean;
    isShowAvatars?: boolean;
    avatarStackCount?: number;
}

export interface ServiceCardSlots {
    left: number;
    unit?: string;
}

export interface ServiceCardDates {
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    lastActiveDate?: moment.Moment;
}

export interface ServiceCardComposition {
    modules?: number;
    lessons?: number;
    broadcasts?: number;
    workshops?: number;
    articles?: number;
    sessions?: number;
    videos?: number;
    durationInSec?: number;
}

export interface ServiceCardImage {
    src: string;
    class?: string;
}

export interface ServiceCardPrice {
    price: number;
    suffix?: string;
    currency?: string;
}

export interface ServiceCardPill {
    label: string;
    class?: string;
}

export interface ServiceCardButton {
	type: ServiceCardButtonType;
    action?: string;
	label?: string;
	icon?: string;
    class?: string;
	size?: number;
	buttons?: ServiceCardButton[];
}

export interface ServiceCardReview {
    value: number;
    hasStar?: boolean;
    count?: number;
}

export interface ServiceCardRsvp {
    going?: number;
    interested?: number;
}
