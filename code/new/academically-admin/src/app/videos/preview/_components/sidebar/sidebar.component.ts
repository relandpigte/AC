import { Component, Input, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  @Input() hidden = false;

  videoId: string;
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;

  constructor(
    route: ActivatedRoute,
  ) {
    this.menuItems.push(new MenuItem('Overview', 'fe-home'));
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Comments', 'fe-message-circle'));
    this.menuItems.push(new MenuItem('Questions', 'fe-help-circle'));
    this.menuItems.push(new MenuItem('Handouts', 'fe-folder'));
    this.menuItems.push(new MenuItem('Offers', 'fe-shopping-bag'));
    this.menuItems.push(new MenuItem('Reviews', 'fe-star'));
    this.activeMenuItem = this.menuItems[3];
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.videoId = paramMap.get('id');
        console.log(this.videoId);
      }
    });
  }

  ngOnInit(): void {
  }

  onMenuItemClick(menuItem: MenuItem): void {
    this.activeMenuItem = menuItem;
  }
}
