import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  videoId: string;
  @Output() menuHidden = new EventEmitter<boolean>();
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;
  isMenuHidden = false;

  constructor(
    route: ActivatedRoute,
  ) {
    this.menuItems.push(new MenuItem('Home', 'fe-home'));
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Comments', 'fe-message-circle'));
    this.menuItems.push(new MenuItem('Downloads', 'fe-download'));
    this.activeMenuItem = this.menuItems[2];

    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.videoId = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
  }

  onMenuItemClick(menuItem: MenuItem): void {
    if (menuItem === this.activeMenuItem || this.isMenuHidden) {
      this.isMenuHidden = !this.isMenuHidden;
      this.menuHidden.emit(this.isMenuHidden);
    }
    this.activeMenuItem = menuItem;
  }
}
