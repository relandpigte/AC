import { ChangeDetectorRef, ElementRef, Injectable, Injector, OnDestroy, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';
import {
  AbpMultiTenancyService, FeatureCheckerService, LocalizationService, MessageService, NotifyService, PermissionCheckerService, SettingService
} from 'abp-ng2-module';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { AppHubBase } from './app-hub-base';
import {
  ArticleDto,
  ArticleType,
  CoachingDto,
  CoachingType,
  CourseDto,
  CourseType,
  DisciplineTaxonomyDto,
  DocumentDto,
  EventCategory,
  EventDto,
  EventType,
  PostDto,
  PostType,
  PricingType,
  UserDto,
  VideoDto,
  VideoType
} from './service-proxies/service-proxies';
import { PubSubService } from './services/pub-sub.service';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { memoize } from 'lodash';

@Injectable()
export abstract class AppComponentBase extends AppHubBase implements OnDestroy {
  public isTutor: boolean;
  public isStudent: boolean;
  public isCurrentUserAdmin: boolean;
  public currentUserId: number;

  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

  cdr: ChangeDetectorRef;
  sanitizer: DomSanitizer;
  localization: LocalizationService;
  permission: PermissionCheckerService;
  feature: FeatureCheckerService;
  notify: NotifyService;
  setting: SettingService;
  message: MessageService;
  multiTenancy: AbpMultiTenancyService;
  appSession: AppSessionService;
  elementRef: ElementRef;
  uploadService: UploadService;
  pubSubService: PubSubService;

  defaultModalSettings: any;

  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(injector: Injector) {
    super();
    this.cdr = injector.get(ChangeDetectorRef);
    this.sanitizer = injector.get(DomSanitizer);
    this.localization = injector.get(LocalizationService);
    this.permission = injector.get(PermissionCheckerService);
    this.feature = injector.get(FeatureCheckerService);
    this.notify = injector.get(NotifyService);
    this.setting = injector.get(SettingService);
    this.message = injector.get(MessageService);
    this.multiTenancy = injector.get(AbpMultiTenancyService);
    this.appSession = injector.get(AppSessionService);
    this.elementRef = injector.get(ElementRef);
    this.uploadService = injector.get(UploadService);
    this.pubSubService = injector.get(PubSubService);

    this.defaultModalSettings = {
      backdrop: 'static',
      ignoreBackdropClick: true,
      keyboard: false,
    };

    if (this.appSession.user) {
      this.isTutor = this.checkUserRole('tutor');
      this.isStudent = this.checkUserRole('student');
      this.isCurrentUserAdmin = this.checkUserRole('admin');
      this.currentUserId = this.appSession.userId;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  l(key: string, ...args: any[]): string {
    let localizedText = this.localization.localize(key, this.localizationSourceName);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, args);
  }

  isGranted(permissionName: string): boolean {
    return this.permission.isGranted(permissionName);
  }

  getProfilePicture = memoize((fileNameOrUrl: string, userId?: number): string => {
    if (fileNameOrUrl) {
      if (this.isValidUrl(fileNameOrUrl)) {
        return fileNameOrUrl;
      } else {
        return `${this.appSession.application.baseDirectory}/${userId}/${this.appSession.application.profilePicturesFolderName}/${fileNameOrUrl}`;
      }
    }
    return 'assets/img/anonymous.png';
  });

  getProfilePictureFromDocument = memoize((document?: DocumentDto, userId?: number): string => {
    if (document) {
      return this.getProfilePicture(document.name, userId);
    }
    return this.getProfilePicture('');
  });

  getCoverPhoto = memoize((coverPhotoUrl: string, userId?: number): string => {
    if (coverPhotoUrl) {
      if (this.isValidUrl(coverPhotoUrl)) {
        return coverPhotoUrl;
      } else {
        return `${this.appSession.application.baseDirectory}/${userId}/`
          + `${this.appSession.application.coverPhotoFolderName}/${coverPhotoUrl}`;
      }
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  });

  getServiceImageUrl = memoize(async (document: DocumentDto): Promise<string> => {
    const imageUrl = await this.uploadService.getFileUrl(document);
    if (imageUrl) {
      return imageUrl;
    }
    return '/assets/themes/dashkit/img/avatars/projects/project-1.jpg';
  });

  getProfilePictureUrl = memoize(async (document?: DocumentDto): Promise<string> => {
    if (document) {
      const imageUrl = await this.uploadService.getFileUrl(document);
      if (imageUrl) {
        return imageUrl;
      }
    }
    return 'assets/img/anonymous.png';
  });

  getCoverPhotoFromDocument = memoize((document?: DocumentDto, userId?: number): string => {
    if (document) {
      return this.getCoverPhoto(document.name, userId);
    }
    return this.getCoverPhoto('');
  });

  convertToUserDate(date: Date): Date {
    return abp.timing.convertToUserTimezone(date);
  }

  convertMomentToUserDate(date: Moment): Date {
    return this.convertToUserDate(date.toDate());
  }

  convertDateToMoment(dateToConvert: Date): Moment {
    return moment().set({
      year: dateToConvert.getFullYear(),
      month: dateToConvert.getMonth(),
      date: dateToConvert.getDate(),
      hour: dateToConvert.getHours(),
      minute: dateToConvert.getMinutes(),
      second: 0,
      millisecond: 0,
    });
  }

  convertMomentToDate(date: Moment): Date {
    return new Date(
      date.year(),
      date.month(),
      date.date(),
      date.hour(),
      date.minute(),
      0,
      0,
    );
  }

  convertMomentToDateIsoString(date: Moment): string {
    return this.convertMomentToDate(date).toISOString();
  }

  convertMomentToDateAgo(date: Moment, removeSuffix = false): string {
    return moment(date).fromNow(removeSuffix);
  }

  convertMomentToTimeRemaining(date: Moment): string {
    const now = moment();
    const dur = moment.duration(date.diff(now));
    const hours = dur.hours();
    const minutes = dur.minutes();
    const seconds = dur.seconds();

    if (hours) {
      return `${hours} hour${ hours > 1 ? 's' : '' }`;
    } else if (minutes) {
      return `${minutes} minute${ minutes > 1 ? 's' : '' }`;
    } else {
      return `${seconds} second${ seconds > 1 ? 's' : '' }`;
    }
  }

  convertMomentToChatChannelTime(date: Moment): string {
    const time = moment(date).format('hh:mm a');
    const days = moment(date).format('ddd');
    const months = moment(date).format('D MMM');
    const years = moment(date).format('DD/MM/YY');

    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 31);
    moment.updateLocale('en', {
      relativeTime : {
        s: 'Just now',
        m: time,
        mm: time,
        h: time,
        hh: time,
        d: days,
        dd: (n): string => {
          if (n <= 7) {
            return days;
          }
          return months;
        },
        M:  months,
        MM: months,
        y:  (): string => {
          const daysDiff = moment().diff(moment(date), 'days');
          if (daysDiff < 365) {
            return months;
          }
          return years;
        },
        yy: years
      }
    });
    return moment(date).fromNow(true);
  }

  convertMomentToChatMessageTime(date: Moment): string {
    const weeks = Math.abs(moment(date).diff(moment(), 'weeks'));
    const years = Math.abs(moment(date).diff(moment(), 'years'));

    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 31);
    moment.updateLocale('en', {
      relativeTime : {
        s: '1m',
        m: '%dm',
        mm: '%dm',
        h: '%dh',
        hh: '%dh',
        d: '%dd',
        dd: (n): string => {
          if (n <= 6) {
            return `${n}d`;
          }
          return weeks < 1 ? `1w` : `${weeks}w`;
        },
        M:  `${weeks}w`,
        MM: `${weeks}w`,
        y:  (): string => {
          const daysDiff = moment().diff(moment(date), 'days');
          if (daysDiff < 365) {
            return `${weeks}w`;
          }
          return `${years}y`;
        },
        yy: `${years}y`
      }
    });
    return moment(date).fromNow(true);
  }

  convertMomentToPostDateAgo(date: Moment, withAgoSuffix = true): string {
    const time = moment(date).format('hh:mm');
    const month = moment(date).format('D MMMM');
    const year = moment(date).format('D MMMM YYYY');

    const formatWithAgo = (value: string) => `${value}${withAgoSuffix ? ' ago' : ''}`;

    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 31);
    moment.updateLocale('en', {
      relativeTime : {
        s: () => 'Just now',
        m:  formatWithAgo('%dm'),
        mm: (n) => formatWithAgo(`${n}m`),
        h:  formatWithAgo('1h'),
        hh: formatWithAgo('%dh'),
        d: () => `Yesterday at ${time}`,
        dd: (n) => {
          if (n <= 13) {
            const calendar = moment(date).calendar(null, {
              lastWeek: 'dddd [at] hh:mm',
              sameElse: '[Last] dddd [at] hh:mm'
            });
            return calendar.toString();
          }
          return `${month} at ${time}`;
        },
        M:  month,
        MM: month,
        y:  () => {
          // Note: 350 days is the default to consider as 1 year for some reasons.
          // This block here checks if it's exact 364 days or less then displays the month format
          // Else display the year format.
          const daysDiff = moment().diff(moment(date), 'days');
          if (daysDiff < 365) {
            return month;
          }
          return year;
        },
        yy: year
      }
    });
    return moment(date).fromNow(true);
  }

  convertScheduleToDisplayFormat(start: Moment, end: Moment): string {
    const startStr = moment(start).format('HH:mm');
    const endStr = moment(end).format('HH:mm[,] DD MMM[,] YYYY');
    return `${startStr}-${endStr}`;
  }

  convertMomentToPostDateFormat(date: Moment): string {
    return moment(date).format('dddd, DD MMMM YYYY [at] hh:mm');
  }

  convertMomentToShorterPostDateFormat(date: Moment): string {
    return moment(date).format('ddd, DD MMM YYYY [at] HH:mm');
  }

  convertMomentToChatDateFormat(date: Moment): string {
    if (moment().diff(date, 'days') < 1) {
      return moment.utc(date).local().format('[today] [at] hh:mm');
    }
    if (moment().diff(date, 'years') < 1) {
      return moment(date).format('dddd, DD MMMM YYYY [at] hh:mm');
    }
    return moment(date).format('dddd, DD MMMM [at] hh:mm');
  }

  convertMomentToShortDateFormat(date: Moment): string {
    if (moment().diff(date, 'days') < 1) return moment.utc(date).local().format('hh:mm a');
    return moment.utc(date).local().format('dddd, DD MMMM YYYY [at] hh:mm a');
  }

  convertMomentToShorterDateFormat(date: Moment): string {
    if (moment().diff(date, 'days') < 1) return moment.utc(date).local().format('hh:mm a');
    return moment.utc(date).local().format('D MMM[,] hh:mm a');
  }

  convertMomentToShorterChatDateFormat(date: Moment): string {
    return moment.utc(date).local().format('hh:mm a');

  }

  convertMomentToQuestionDateFormat(date: Moment): string {
    if (moment().diff(date, 'days') < 1) return moment.utc(date).local().format('hh:mm');
    return moment.utc(date).local().format('D MMM[,] hh:mm a');
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/avatars/projects/project-1.jpg';
  }

  formatBytes(bytes: number | null, decimals = 2) {
    if (!bytes || bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i].toLowerCase();
  }

  getFileExtension(fileName: string | null): string {
    return fileName?.split('.').pop() ?? '-';
  }

  createRange(number: number): number[] {
    return new Array(number);
  }

  zeroIfNull(num: number): number {
    return num ?? 0;
  }

  getNameInitials(user: UserDto): string {
    return `${user.name.charAt(0)}${user.surname.charAt(0)}`;
  }

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  removeHTMLTags(str: string): string | boolean {
    if ((str === null) || (str === '') || str === undefined) {
      return;
    } else {
      str = str.toString();
    }
    return str.replace( /(<([^>]+)>)/ig, '');
  }

  getFileIcon(fileType: string): string {
    if (fileUploadConfiguration.allowedImageExtensions.includes(fileType.replace(/^/, '.'))) {
      return '/assets/img/service/icons/image.svg';
    }
    if (fileUploadConfiguration.videoExtensions.includes(fileType.replace(/^/, '.'))) {
      return '/assets/img/service/icons/video.svg';
    }
    if (fileUploadConfiguration.docExtension.includes(fileType.replace(/^/, '.'))) {
      return '/assets/img/service/icons/document.svg';
    }
    return '/assets/img/service/icons/folder.svg';
  }

  protected chunkArrayInGroups(arr, size) {
    var result = [];
    for (var i=0; i<arr.length; i+=size)
      result.push(arr.slice(i, i+size));
    return result;
  }

  protected uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        // tslint:disable-next-line: no-bitwise
        const r = (Math.random() * 16) | 0,
          // tslint:disable-next-line: no-bitwise
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  protected diffDatesSeconds(date1: Date, date2: Date): number {
    const diffDatesSeconds = date1.getTime() - date2.getTime();
    const diffSeconds = diffDatesSeconds / 1000;
    return Math.round(diffSeconds);
  }

  protected diffMomentDatesSeconds(date1: Moment, date2: Moment): number {
    return this.diffDatesSeconds(this.convertMomentToUserDate(date1), this.convertMomentToUserDate(date2));
  }

  protected formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.substr(phoneNumber.indexOf(' ') + 1);
  }

  protected checkUserRole(role: string): boolean {
    return this.appSession.user.roles.findIndex(e => e.toLowerCase() === role) >= 0;
  }

  protected checkUserRoleFromUser(role: string, user: UserDto): boolean {
    return user.roleNames.findIndex(e => e.toLowerCase() === role) >= 0;
  }

  protected calculateDuration(startTime: Moment, endTime: Moment): number {
    return Math.round(moment.duration(endTime.diff(startTime)).asMinutes());
  }

  protected formatDuration(durationInMinutes: number): string {
    const durationHours = Math.floor(durationInMinutes / 60).toString().padStart(2, '0');
    const durationMinutes = (durationInMinutes % 60).toString().padStart(2, '0');
    const duration = `${durationHours}:${durationMinutes}`;
    return duration;
  }

  protected strPadLeft(value: number, length: number, paddingText = '0') {
    return (new Array(length + 1).join(paddingText) + value).slice(-length);
  }

  protected pipeDestroy<TObject>(
    o: Observable<TObject>,
    callback?: (response?: TObject) => void,
    finalizeCallback?: () => void,
  ): void {
    o.pipe(
      takeUntil(this.destroyed$),
      distinctUntilChanged(),
      finalize(() => {
        if (finalizeCallback) {
          finalizeCallback();
        }
      }),
    ).subscribe((response?: TObject) => {
      if (callback) {
        callback(response);
      }
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      // tslint:disable-next-line: no-unused-expression
      new URL(url);
    } catch (_) {
      return false;
    }

    return true;
  }

  randomNonZero = (max, min = 1) => Math.floor(Math.random() * (max - min)) + min;
  hasValidItemsList = (items: any[]): boolean => items && items.length > 0 && !items.some(i => !i.id);

  generateRandomCourse(): CourseDto {
    var course = new CourseDto();
    var id = null;

    course.id = id;
    course.type = CourseType.Standard;
    course.name = `Test Course #${this.randomNonZero(1000)}`;
    course.description = `Test Description #${this.randomNonZero(1000)}`;
    course.pricingType = PricingType.FixedPrice;
    course.price = this.randomNonZero(500);

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.fullName = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    course.creatorUser = creator;

    return course;
  }

  generateRandomArticle(): ArticleDto {
    var article = new ArticleDto();
    var id = null;

    article.id = id;
    article.type = ArticleType.SingleArticle;
    article.name = `Test Article #${this.randomNonZero(1000)}`;
    article.description = `Test Description #${this.randomNonZero(1000)}`;
    article.pricingType = PricingType.FixedPrice;
    article.price = this.randomNonZero(500);

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.fullName = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    return article;
  }

  generateRandomCoaching(): CoachingDto {
    var coaching = new CoachingDto();
    var id = null;

    coaching.id = id;
    coaching.type = CoachingType.Single;
    coaching.name = `Test Coaching #${this.randomNonZero(1000)}`;
    coaching.description = `Test Description #${this.randomNonZero(1000)}`;
    coaching.pricingType = PricingType.FixedPrice;
    coaching.price = this.randomNonZero(500);

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.fullName = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    coaching.creatorUser = creator;

    return coaching;
  }

  generateRandomEvent(category?: EventCategory): EventDto {
    var event = new EventDto;
    var id = null;

    event.id = id;
    event.category = category ?? this.randomNonZero(1, 0);
    event.type = EventType.Single;
    event.name = `Test Event #${this.randomNonZero(1000)}`;
    event.description = `Test Description #${this.randomNonZero(1000)}`;
    event.pricingType = PricingType.FixedPrice;
    event.price = this.randomNonZero(500);
    event.duration = this.randomNonZero(10000);
    event.endDate = moment().add(this.randomNonZero(20, 10), 'days');
    event.eventDateTime = moment().add(this.randomNonZero(6000), 'minutes');

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.fullName = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    event.creatorUser = creator;

    return event;
  }

  generateRandomTutorial(): VideoDto {
    var video = new VideoDto;
    var id = null;

    video.id = id;
    video.categories = 'Tutorials, Videos';
    video.name = `Test Tutorial #${this.randomNonZero(1000)}`;
    video.description = `Test Description #${this.randomNonZero(1000)}`;
    video.pricingType = PricingType.FixedPrice;
    video.price = this.randomNonZero(500);
    video.price = this.randomNonZero(10000);
    video.type = VideoType.VideoSeries;


    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.fullName = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    video.creatorUser = creator;

    return video;
  }

  generateRandomSpace(): any {
    let space: any = {};
    var id = null;

    space.id = id;
    space.categories = 'Tutorials, Videos';
    space.name = `This is a space title #${this.randomNonZero(1000)}`;
    space.description = `Space Description #${this.randomNonZero(1000)}`;
    space.pricingType = PricingType.FixedPrice;
    space.price = this.randomNonZero(500);
    space.price = this.randomNonZero(10000);
    space.type = VideoType.VideoSeries;


    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.fullName = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    space.creatorUser = creator;

    return space;
  }

  generateRandomUser(): UserDto {
    var id = null;
    var user = new UserDto();
    user.id = this.randomNonZero(200);
    user.name = 'Test User1';
    user.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;
    user.about = `Test about this user biography.`;

    return user;
  }

  generateRandomTopic(): any {
    return { name: 'Topic' };
  }

  generateRandomPost(): PostDto {
    const post = new PostDto();
    post.id = this.uuidv4();
    post.content = 'Test Post';
    post.type = PostType.QuickPost;
    return post;
  }

  generateRandomTopics(): DisciplineTaxonomyDto {
    const topics = new DisciplineTaxonomyDto();
    topics.id = this.uuidv4();
    topics.name = 'Test name';
    return topics;
  }

  loadInfiniteData(service: any, functionName: string, args: any[], destinationField: string, opts: { allowLoader?: boolean, destinationFieldKey?: string, callback?: () => void } = { allowLoader: true }): void {
    const loader = opts?.destinationFieldKey ? this[`isLoading_${destinationField}$`][opts.destinationFieldKey] : this[`isLoading_${destinationField}$`];
    loader.next(opts?.allowLoader && true)
    service[functionName](...args)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => loader.next(false)))
      .subscribe(newData => {
        if (opts?.destinationFieldKey) {
          if (this[`${destinationField}MaxItems`][opts.destinationFieldKey] == 0) this[destinationField][opts.destinationFieldKey] = [];
          if (newData) {
            const items = this.deepSearch(newData, 'items');
            this[`${destinationField}MaxItems`][opts.destinationFieldKey] = this.deepSearch(newData, 'totalCount');
            this[destinationField][opts.destinationFieldKey] = _.concat(this[destinationField][opts.destinationFieldKey], items);
          }
        } else {
          if (this[`${destinationField}MaxItems`] == 0) this[destinationField] = [];
          if (newData) {
            const items = this.deepSearch(newData, 'items');
            this[`${destinationField}MaxItems`] = this.deepSearch(newData, 'totalCount');
            this[destinationField] = _.concat(this[destinationField], items);
          }
        }
        if (opts?.callback) opts.callback.call(this);
      });
  }

  private deepSearch(object, key) {
    if (!(object instanceof Array)) object = [object];
    let values: any;
    for (const o of object)
      if (key in o) {
        if (o[key] instanceof Array) values = [...(values ?? []), ...o[key]];
        else values = (values ?? 0) + o[key];
      } else {
        return this.deepSearch(Object.values(o), key);
      }
    return values;
  }

  scrollToMiddleHighlightedComment(): void {
    const highlightedComment = this.elementRef.nativeElement.querySelectorAll('.anim-outline-highlighted');
    if (highlightedComment?.length) {
      const mid = _.sortBy(highlightedComment, c => c.offsetTop)[Math.floor(highlightedComment.length / 2)];
      mid.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  removeHighlightsInComments(): void {
      const highlightedComments = this.elementRef.nativeElement.querySelectorAll('.anim-outline-highlighted');
      highlightedComments?.forEach(c => c.classList.remove('anim-outline-highlighted'));
  }
}
