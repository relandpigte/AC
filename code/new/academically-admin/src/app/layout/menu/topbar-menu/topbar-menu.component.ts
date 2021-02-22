import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BaseMenu } from '@shared/models/base-menu';

@Component({
  selector: 'topbar-menu',
  templateUrl: './topbar-menu.component.html',
})
export class TopbarMenuComponent extends BaseMenu {
  constructor(injector: Injector, router: Router) {
    super(injector, router);
  }
}
