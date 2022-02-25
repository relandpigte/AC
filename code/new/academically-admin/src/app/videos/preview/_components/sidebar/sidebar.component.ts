import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    this.menuItems.push(new MenuItem('Downloads', 'fe-download'));
    this.activeMenuItem = this.menuItems[0];

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
