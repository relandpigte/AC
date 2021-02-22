import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BaseMenu } from '@shared/models/base-menu';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent extends BaseMenu {
  constructor(injector: Injector, router: Router) {
    super(injector, router);
  }
}
