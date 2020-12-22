import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GetProfileDetailDto, TimezonesServiceProxy, UserProfilesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [appModuleAnimation()]
})
export class HomeComponent extends AppComponentBase implements OnInit {
  activeTab: string;
  userProfile: GetProfileDetailDto = new GetProfileDetailDto();
  timezoneName = null;
  constructor(injector: Injector, private _timezoneService: TimezonesServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.activeTab = 'Dashboard';
    this.getTimezoneDetails();
  }

  onToggleClick(value) {
    this.activeTab = value;
  }

  private getTimezoneDetails(): void {
    this._timezoneService.get().subscribe(timezone => {
      if (timezone) {
        this.timezoneName = timezone.name;
      }
    });
  }
}
