import { Injector, ElementRef } from '@angular/core';
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

export abstract class AppComponentBase {

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
    //   if (fileNameOrUrl) {
    //     if (this.isValidUrl(fileNameOrUrl)) {
    //       return fileNameOrUrl;
    //     } else {
    //       return `${this.appSession.user.directoryBaseUrl}/${userId}/profile-pictures/${fileNameOrUrl}`;
    //     }
    //   }
    return 'assets/img/anonymous.png';
  }

  getCoverPhoto(coverPhotoUrl: string): string {
    if (coverPhotoUrl) {
      return coverPhotoUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  protected convertToUserDate(date: Date): Date {
    return abp.timing.convertToUserTimezone(date);
  }

  protected convertMomentToUserDate(date: Moment): Date {
    return this.convertToUserDate(date.toDate());
  }

  protected diffDatesSeconds(date1: Date, date2: Date): number {
    var diffDatesSeconds = date1.getTime() - date2.getTime();
    var diffSeconds = diffDatesSeconds / 1000;
    return Math.round(diffSeconds);
  }

  protected diffMomentDatesSeconds(date1: Moment, date2: Moment): number {
    return this.diffDatesSeconds(this.convertMomentToUserDate(date1), this.convertMomentToUserDate(date2));
  }
}
