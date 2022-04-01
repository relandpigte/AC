import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';

class MenuItem {
  name: string;
  icon: string;

  constructor(name: string, icon?: string) {
    this.name = name;
    this.icon = icon;
  }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent extends AppComponentBase implements OnInit {
  @Input() hidden = false;

  eventId: string;
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
  ) {
    super(injector);
    this.menuItems.push(new MenuItem('Overview', 'fe-home'));
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Attendees', 'fe-users'));
    this.menuItems.push(new MenuItem('Comments', 'fe-message-circle'));
    this.menuItems.push(new MenuItem('Questions', 'fe-help-circle'));
    this.menuItems.push(new MenuItem('Handouts', 'fe-folder'));
    this.menuItems.push(new MenuItem('Offers', 'fe-shopping-bag'));
    this.menuItems.push(new MenuItem('Reviews', 'fe-star'));
    this.activeMenuItem = this.menuItems[0];
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.eventId = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
  }

  onMenuItemClick(menuItem: MenuItem): void {
    this.activeMenuItem = menuItem;
  }

}
