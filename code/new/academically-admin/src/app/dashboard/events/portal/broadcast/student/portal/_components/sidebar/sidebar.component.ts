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
  @Input() isHost: boolean;

  eventId: string;
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
  ) {
    super(injector);
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Overview', 'home.svg'));
    this.menuItems.push(new MenuItem('Attendees', 'users.svg'));
    this.menuItems.push(new MenuItem('Comments', 'chat.svg'));
    this.menuItems.push(new MenuItem('Questions', 'help.svg'));
    this.menuItems.push(new MenuItem('Polls', 'pie-chart.svg'));
    this.menuItems.push(new MenuItem('Handouts', 'folder.svg'));
    this.menuItems.push(new MenuItem('Offers', 'shopping-bag.svg'));
    this.menuItems.push(new MenuItem('Reviews', 'star.svg'));
    if (!this.isHost) {
      this.menuItems.push(new MenuItem('Separator'));
      this.menuItems.push(new MenuItem('Settings', 'sliders.svg'));
    }
    this.activeMenuItem = this.menuItems[1];
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.eventId = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
  }

  onMenuItemClick(menuItem: MenuItem, e: Event): void {
    e.preventDefault();
    this.activeMenuItem = menuItem;
  }
}
