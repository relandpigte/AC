import { Component, Injector } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { AppComponentBase } from '@shared/app-component-base';
import { countries } from '@shared/constants/countries';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less']
})
export class SummaryComponent extends AppComponentBase {
  user: UserDto;
  userAddress: string;
  isViewOnly = true;
  isEditingWebsiteUrl = false;
  isSavingWebsiteUrl = false;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    profileService.user$.subscribe(user => {
      this.user = user;
      const countryCode = countries.find(e => e.name === this.user.country);
      const userAddressArr: string[] = [];
      this.pushToArray(userAddressArr, user.city);
      this.pushToArray(userAddressArr, countryCode ? countryCode.code : '');
      this.userAddress = userAddressArr.join(', ');
    });
    profileService.isViewOnly$.subscribe(isViewOnly => {
      this.isViewOnly = isViewOnly;
    });
  }

  onEditWebsiteUrlClick(): void {
    this.isEditingWebsiteUrl = true;
  }

  onSaveWebsiteUrlClick(): void {
    this.isSavingWebsiteUrl = true;
    this._profilesService.updateWebsiteUrl(this.user.websiteUrl ?? undefined)
      .subscribe(() => {
        this.isEditingWebsiteUrl = false;
        this.isSavingWebsiteUrl = false;
      });
  }

  onCopyToClipboardClick(): void {
    let link = `${location.origin}/app/profile/${this.user.id}`;
    if (this.user.websiteUrl) {
      link = this.user.websiteUrl;
    }

    navigator.clipboard
      .writeText(link)
      .then(() => {
        this.notify.success(this.l('LinkCopiedToClipboard'));
      })
      .catch((e) => console.error(e));
  }

  private pushToArray(arr: string[], item: string) {
    if (item) {
      arr.push(item);
    }
  }
}
