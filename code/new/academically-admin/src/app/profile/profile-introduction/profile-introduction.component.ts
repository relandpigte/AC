import { Component, Injector } from '@angular/core';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { countries } from '@shared/constants/countries';
import { AppComponentBase } from '@shared/app-component-base';
@Component({
  selector: 'app-profile-introduction',
  templateUrl: './profile-introduction.component.html',
  styleUrls: ['./profile-introduction.component.less']
})
export class ProfileIntroductionComponent extends AppComponentBase {
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
    profileService.$user.subscribe(user => {
      this.user = user;
      const countryCode = countries.find(e => e.name === this.user.country);
      const userAddressArr: string[] = [];
      this.pushToArray(userAddressArr, user.city);
      this.pushToArray(userAddressArr, countryCode ? countryCode.code : '');
      this.userAddress = userAddressArr.join(', ');
    });
    profileService.$isViewOnly.subscribe(isViewOnly => {
      this.isViewOnly = isViewOnly;
    });
  }

  onEditWebsiteUrlClick(): void {
    this.isEditingWebsiteUrl = true;
  }

  onSaveWebsiteUrlClick(): void {
    this.isSavingWebsiteUrl = true;
    this._profilesService.updateWebsiteUrl(this.user.websiteUrl)
      .subscribe(() => {
        this.isEditingWebsiteUrl = false;
        this.isSavingWebsiteUrl = false;
      });
  }

  private pushToArray(arr: string[], item: string) {
    if (item) {
      arr.push(item);
    }
  }
}
