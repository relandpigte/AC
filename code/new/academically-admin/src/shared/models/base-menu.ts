import { Component, Injector, Input } from '@angular/core';
import { PRIMARY_OUTLET, Router, RouterEvent } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { MenuItem } from '@shared/layout/menu-item';

@Component({
  template: ''
})
export abstract class BaseMenu extends AppComponentBase {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  homeRoute = '/app/dashboard';

  constructor(injector: Injector, private _router: Router) {
    super(injector);
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
  }

  @Input() set routerEvent(event: RouterEvent) {
    if (!event) return;
    const currentUrl = event.url !== '/' ? event.url : this.homeRoute;
    const primaryUrlSegmentGroup = this._router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
    if (primaryUrlSegmentGroup) {
      this.activateMenuItems('/' + primaryUrlSegmentGroup.toString());
    }
  }

  protected getMenuItems(): MenuItem[] {
    return [
      // new MenuItem(this.l('Dashboard'), '/app/dashboard', 'fe fe-home', 'Pages.Dashboard'),
      // new MenuItem(this.l('Home'), '/app/home', 'fe fe-home', 'Pages.Home'),
      new MenuItem(this.l('Explore'), '/app/explore', 'fe fe-home', 'Pages.Home'),
      new MenuItem(this.l('Community'), '/app/community/following', 'fe fe-home', 'Pages.Community'),
      new MenuItem(this.l('Dashboard'), '', 'fe fe-home', 'Pages.Dashboard', [
        new MenuItem(this.l('Overview'), '/app/dashboard/overview', 'fe fe-feather', 'Pages.Dashboard.Overview'),
        new MenuItem(this.l('Coaching'), '/app/dashboard/coaching', 'fe fe-users', 'Pages.Dashboard.Coaching'),
        new MenuItem(this.l('Courses'), '/app/dashboard/courses', 'fe fe-book', 'Pages.Dashboard.Courses'),
        new MenuItem(this.l('Tutorials'), '/app/dashboard/tutorials', 'fe fe-video', 'Pages.Videos'),
        new MenuItem(this.l('Articles'), '/app/articles', 'fe fe-file-text', 'Pages.Articles'),
        new MenuItem(this.l('Events'), '/app/dashboard/events', 'fe fe-cast', 'Pages.Events'),
      ]),
      // new MenuItem(this.l('OverseasStudy'), '#', 'fe fe-globe'),
      // new MenuItem(this.l('Blog'), '#', 'fe fe-message-circle'),
      new MenuItem(this.l('AcademicSupport'), '', 'fe fe-book', 'Pages.Dashboard.Navigations.AcademicSupport', [
        new MenuItem(this.l('PeerSupport'), '/app/peer-support', 'fe fe-users', 'Pages.PeerSupport', [
          new MenuItem(this.l('Tutorial'), '/app/tutorial', 'fe fe-book-open', 'Pages.PeerSupport.Tutorial'),
          new MenuItem(this.l('Proposals'), '/app/proposals', 'fe fe-bell', 'Pages.PeerSupport.Proposals')
        ]),
        new MenuItem(this.l('StudySkills'), '/app/study-skills', 'fe fe-grid', 'Pages.Account')
      ]),
      new MenuItem(this.l('Tenants'), '/app/tenants', 'fas fa-building', 'Pages.Tenants'),
      new MenuItem(this.l('Suggestions'), '', 'fe fe-alert-circle', 'Pages.Suggestions', [
        new MenuItem(this.l('ServiceSubjects'), '/app/suggestions/service-subjects', 'fe fe-bookmark', 'Pages.Suggestions.ServiceSubjects'),
      ]),
      new MenuItem(this.l('Settings'), '', 'fe fe-settings', '', [
        new MenuItem(this.l('TutorApplications'), '/app/tutor-applications', 'fe fe-user-check', 'Pages.TutorApplications'),
        new MenuItem(this.l('Users'), '/app/users', 'fe fe-users', 'Pages.Users'),
        new MenuItem(this.l('Roles'), '/app/roles', 'fe fe-lock', 'Pages.Roles'),
      ]),
      new MenuItem(this.l('Topics'), '', 'fe fe-trending-up', 'Pages.Topics.Usage', [
        new MenuItem(this.l('Usage'), '/app/topics/usage', 'fe fe-bar-chart-2', 'Pages.Topics.Usage'),
      ]),
      new MenuItem(this.l('SeeAllProjects'), '/app/projects/browse', 'fe fe-briefcase', 'Pages.Projects.Browse'),
      new MenuItem(this.l('Schedule'), '/app/calendar', 'fe fe-calendar'),
      // new MenuItem(this.l('Forums'), '/app/forums', 'fe fe-hash', 'Pages.Forums'),
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
      let notGrantedCount = 0;
      item.children.forEach(child => {
        isGranted = this.isMenuItemVisible(child);
        if (!isGranted) {
          notGrantedCount++;
        }
      });
      return notGrantedCount !== item.children.length;
    } else {
      if (!item.permissionName) {
        return true;
      }
      return this.permission.isGranted(item.permissionName);
    }
  }
}
