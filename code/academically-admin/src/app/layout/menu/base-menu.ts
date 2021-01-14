import { Injector, Input } from '@angular/core';
import { PRIMARY_OUTLET, Router, RouterEvent } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { MenuItem } from '@shared/layout/menu-item';

export abstract class BaseMenu extends AppComponentBase {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  homeRoute = '/app/home';

  constructor(injector: Injector, private _router: Router) {
    super(injector);
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
  }

  @Input() set routerEvent(event: RouterEvent) {
    const currentUrl = event.url !== '/' ? event.url : this.homeRoute;
    const primaryUrlSegmentGroup = this._router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
    if (primaryUrlSegmentGroup) {
      this.activateMenuItems('/' + primaryUrlSegmentGroup.toString());
    }
  }

  protected getMenuItems(): MenuItem[] {
    return [
      new MenuItem(this.l('Dashboard'), '/app/home', 'fe fe-home', 'Pages.Dashboard'),
      new MenuItem(this.l('AcademicSupport'), '', 'fe fe-book', 'Pages.Dashboard.Navigations.AcademicSupport', [
        new MenuItem(this.l('PeerSupport'), '/app/peer-support', 'fe fe-users', 'Pages.PeerSupport', [
          new MenuItem(this.l('Tutorial'), '/app/tutorial', 'fe fe-book-open', 'Pages.PeerSupport.Tutorial'),
          new MenuItem(this.l('Proposals'), '/app/proposals', 'fe fe-bell', 'Pages.PeerSupport.Proposals')
        ]),
        new MenuItem(this.l('StudySkills'), '/app/study-skills', 'fe fe-grid', 'Pages.Account')
      ]),
      new MenuItem(this.l('Tenants'), '/app/tenants', 'fas fa-building', 'Pages.Tenants'),
      new MenuItem(this.l('Settings'), '', 'fe fe-settings', '', [
        new MenuItem(this.l('Users'), '/app/users', 'fe fe-users', 'Pages.Users'),
        new MenuItem(this.l('Roles'), '/app/roles', 'fe fe-lock', 'Pages.Roles')
      ])
    ];
  }

  protected patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  protected activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach(item => {
      this.activateMenuItem(item);
    });
  }

  protected deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  protected findMenuItemsByUrl(url: string, items: MenuItem[], foundedItems: MenuItem[] = []): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  protected activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  protected isMenuItemVisible(item: MenuItem): boolean {
    if (item.children && item.children.length > 0) {
      let isGranted = true;
      item.children.forEach(child => {
        isGranted = this.isMenuItemVisible(child);
        if (!isGranted) {
          return false;
        }
      });
      return isGranted;
    } else {
      if (!item.permissionName) {
        return true;
      }
      return this.permission.isGranted(item.permissionName);
    }
  }
}
