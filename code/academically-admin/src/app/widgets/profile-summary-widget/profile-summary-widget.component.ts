import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GetProfileDetailDto, ProfileSummaryWidgetDto, WidgetsServiceProxy } from '@shared/service-proxies/service-proxies';
import { uiEvents } from '@shared/constants/ui-events';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'profile-summary-widget',
  templateUrl: './profile-summary-widget.component.html',
  styleUrls: ['./profile-summary-widget.component.less'],
})
export class ProfileSummaryWidgetComponent extends AppComponentBase implements OnInit {
  model: ProfileSummaryWidgetDto = new ProfileSummaryWidgetDto();
  isLoading = false;

  constructor(injector: Injector, private _widgetsServiceProxy: WidgetsServiceProxy, private cd: ChangeDetectorRef) {
    super(injector);
    abp.event.on(uiEvents.profileDetailsUpdated, (item: GetProfileDetailDto) => {
      this.model.profilePictureUrl = item.profilePictureUrl;
      this.model.fullName = `${item.firstName} ${item.lastName}`;
    });
  }

  ngOnInit(): void {
    this.getProfileSummaryWidget();
  }

  private getProfileSummaryWidget(): void {
    this.isLoading = true;
    this._widgetsServiceProxy.getProfileSummary().subscribe((widget) => {
      this.model = widget;
      this.isLoading = false;
      this.cd.detectChanges();
    });
  }
}
