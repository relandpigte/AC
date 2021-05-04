import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.less']
})
export class AccountSettingsComponent extends AppComponentBase {

  constructor(injector: Injector) {
    super(injector);
  }
}
