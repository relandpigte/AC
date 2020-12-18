import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GetProfileDetailDto, UserProfilesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [appModuleAnimation()]
})
export class HomeComponent extends AppComponentBase implements OnInit {
  activeTab: string;
  userProfile: GetProfileDetailDto = new GetProfileDetailDto();
  timezoneName = '';
  constructor(injector: Injector, private _usersProfilesService: UserProfilesServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.activeTab = 'Dashboard';
    this.getProfileDetail();
  }

  onToggleClick(value) {
    this.activeTab = value;
  }

  private getProfileDetail(): void {
    this._usersProfilesService.getDetail(this.appSession.user.id).subscribe(userProfile => {
      if (userProfile.timezoneId) {
        this.timezoneName = userProfile.timeZoneInfo.displayName;
      }
    });
  }
}
