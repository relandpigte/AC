import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.less']
})
export class ProfileSummaryComponent extends AppComponentBase {
  user: UserLoginInfoDto;
  userTitle: string;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.user = this.appSession.user;
    this.userTitle = this.user.roles.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Student';
  }

}
