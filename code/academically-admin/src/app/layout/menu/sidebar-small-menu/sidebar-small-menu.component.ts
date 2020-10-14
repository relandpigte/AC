import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BaseMenu } from '../base-menu';

@Component({
  selector: 'sidebar-small-menu',
  templateUrl: './sidebar-small-menu.component.html',
})
export class SidebarSmallMenuComponent extends BaseMenu {
  constructor(injector: Injector, router: Router) {
    super(injector, router);
  }
}
