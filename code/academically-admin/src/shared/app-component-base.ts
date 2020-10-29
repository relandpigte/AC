import { Injector, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
  LocalizationService,
  PermissionCheckerService,
  FeatureCheckerService,
  NotifyService,
  SettingService,
  MessageService,
  AbpMultiTenancyService,
} from 'abp-ng2-module';

import { AppSessionService } from '@shared/session/app-session.service';
import { ModalOptions } from 'ngx-bootstrap/modal';

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

  imageUploadPlaceholderText: string;
  defaultModalSettings: ModalOptions;

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

    this.imageUploadPlaceholderText = this.l('DropOrClickToUpload');
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

  getImageUrl(defaultUrl: string): string {
    return defaultUrl ? defaultUrl : 'assets/img/anonymous.png';
  }

  protected enumToArray(enumeraton) {
    return Object.keys(enumeraton)
      .filter((e) => isNaN(Number(e)) === true)
      .map((key) => enumeraton[key]);
  }
}
