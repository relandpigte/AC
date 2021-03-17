import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
})
export class HomeComponent extends AppComponentBase {
  user: UserLoginInfoDto = new UserLoginInfoDto();;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.user = this.appSession.user;
  }
}
