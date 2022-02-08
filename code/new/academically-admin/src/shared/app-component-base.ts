import { Injector, ElementRef, OnDestroy, Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
  LocalizationService,
  PermissionCheckerService,
  FeatureCheckerService,
  NotifyService,
  SettingService,
  MessageService,
  AbpMultiTenancyService
} from 'abp-ng2-module';

import { AppSessionService } from '@shared/session/app-session.service';
import { Moment } from 'moment';
import { DocumentDto, UserDto } from './service-proxies/service-proxies';
import { ReplaySubject } from 'rxjs';
import * as moment from 'moment';

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

  convertMomentToDateAgo(date: Moment): string {
    return moment(date).fromNow();
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/avatars/projects/project-1.jpg';
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

  private isValidUrl(url: string): boolean {
    try {
      // tslint:disable-next-line: no-unused-expression
      new URL(url);
    } catch (_) {
      return false;
    }

    return true;
  }
}
