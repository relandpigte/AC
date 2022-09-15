import { ElementRef, Injectable, Injector, OnDestroy } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
  AbpMultiTenancyService, FeatureCheckerService, LocalizationService, MessageService, NotifyService, PermissionCheckerService, SettingService
} from 'abp-ng2-module';

import { UploadService } from '@app/_shared/services/upload.service';
import { AppSessionService } from '@shared/session/app-session.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ArticleDto, ArticleType, CoachingDto, CoachingType, CourseDto, CourseType, DocumentDto, EventDto, EventType, PricingType, UserDto, WorkshopDto, WorkshopType } from './service-proxies/service-proxies';

@Injectable()
export abstract class AppComponentBase implements OnDestroy {
  public isTutor: boolean;
  public isStudent: boolean;

  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

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

  defaultModalSettings: any;

  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(injector: Injector) {
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

    this.defaultModalSettings = {
      backdrop: 'static',
      ignoreBackdropClick: true,
      keyboard: false,
    };
    if (this.appSession.user) {
      this.isTutor = this.checkUserRole('tutor');
      this.isStudent = this.checkUserRole('student');
    }
  }

  ngOnDestroy(): void {
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

  getProfilePicture(fileNameOrUrl: string, userId?: number): string {
    if (fileNameOrUrl) {
      if (this.isValidUrl(fileNameOrUrl)) {
        return fileNameOrUrl;
      } else {
        return `${this.appSession.application.baseDirectory}/${userId}/${this.appSession.application.profilePicturesFolderName}/${fileNameOrUrl}`;
      }
    }
    return 'assets/img/anonymous.png';
  }

  getProfilePictureFromDocument(document?: DocumentDto, userId?: number): string {
    if (document) {
      return this.getProfilePicture(document.name, userId);
    }
    return this.getProfilePicture('');
  }

  getCoverPhoto(coverPhotoUrl: string, userId?: number): string {
    if (coverPhotoUrl) {
      if (this.isValidUrl(coverPhotoUrl)) {
        return coverPhotoUrl;
      } else {
        return `${this.appSession.application.baseDirectory}/${userId}/`
          + `${this.appSession.application.coverPhotoFolderName}/${coverPhotoUrl}`;
      }
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  getServiceImageUrl(document: DocumentDto): string {
    const imageUrl = this.uploadService.getFileUrl(document);
    if (imageUrl) {
      return imageUrl;
    }
    return '/assets/themes/dashkit/img/avatars/projects/project-1.jpg';
  }

  getProfilePictureUrl(document?: DocumentDto): string {
    if (document) {
      const imageUrl = this.uploadService.getFileUrl(document);
      if (imageUrl) {
        return imageUrl;
      }
    }
    return 'assets/img/anonymous.png';
  }

  getCoverPhotoFromDocument(document?: DocumentDto, userId?: number): string {
    if (document) {
      return this.getCoverPhoto(document.name, userId);
    }
    return this.getCoverPhoto('');
  }

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

  generateRandomCourse(): CourseDto {
    var course = new CourseDto();
    var id = this.uuidv4();

    course.id = id;
    course.type = CourseType.Standard;
    course.name = `Test Course #${this.randomNonZero(1000)}`;
    course.description = `Test Description #${this.randomNonZero(1000)}`;
    course.pricingType = PricingType.FixedPrice;
    course.price = this.randomNonZero(500);

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.name = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    course.creatorUser = creator;

    return course;
  }

  generateRandomWorkshop(): WorkshopDto {
    var workshop = new WorkshopDto();
    var id = this.uuidv4();

    workshop.id = id;
    workshop.type = WorkshopType.Single;
    workshop.name = `Test Workshop #${this.randomNonZero(1000)}`;
    workshop.description = `Test Description #${this.randomNonZero(1000)}`;
    workshop.pricingType = PricingType.FixedPrice;
    workshop.price = this.randomNonZero(500);
    workshop.duration = this.randomNonZero(10000);
    workshop.endDate = moment().add(this.randomNonZero(20, 10), 'days');
    workshop.workshopDateTime = moment().add(this.randomNonZero(6000), 'minutes');

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.name = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    workshop.creatorUser = creator;

    return workshop;
  }

  generateRandomArticle(): ArticleDto {
    var article = new ArticleDto();
    var id = this.uuidv4();

    article.id = id;
    article.type = ArticleType.SingleArticle;
    article.name = `Test Article #${this.randomNonZero(1000)}`;
    article.description = `Test Description #${this.randomNonZero(1000)}`;
    article.pricingType = PricingType.FixedPrice;
    article.price = this.randomNonZero(500);

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.name = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    return article;
  }

  generateRandomCoaching(): CoachingDto {
    var coaching = new CoachingDto();
    var id = this.uuidv4();

    coaching.id = id;
    coaching.type = CoachingType.Single;
    coaching.name = `Test Coaching #${this.randomNonZero(1000)}`;
    coaching.description = `Test Description #${this.randomNonZero(1000)}`;
    coaching.pricingType = PricingType.FixedPrice;
    coaching.price = this.randomNonZero(500);

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.name = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    coaching.creatorUser = creator;

    return coaching;
  }

  generateRandomEvent(): EventDto {
    var event = new EventDto;
    var id = this.uuidv4();

    event.id = id;
    event.type = EventType.SingleEvent;
    event.name = `Test Event #${this.randomNonZero(1000)}`;
    event.description = `Test Description #${this.randomNonZero(1000)}`;
    event.pricingType = PricingType.FixedPrice;
    event.price = this.randomNonZero(500);
    event.duration = this.randomNonZero(10000);
    event.endDate = moment().add(this.randomNonZero(20, 10), 'days');
    event.eventDateTime = moment().add(this.randomNonZero(6000), 'minutes');

    var creator = new UserDto();
    creator.id = this.randomNonZero(200);
    creator.name = 'Creator User1';
    creator.profilePictureUrl = `https://i.pravatar.cc/300?u=${id}`;

    event.creatorUser = creator;

    return event;
  }
}
