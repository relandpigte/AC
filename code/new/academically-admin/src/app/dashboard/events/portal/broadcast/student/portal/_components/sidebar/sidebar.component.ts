import { Component, OnInit, Injector, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';

class MenuItem {
  name: string;
  className: string;

  constructor(name: string, className?: string) {
    this.name = name;
    this.className = className;
  }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() hidden = false;
  @Input() isHost: boolean;

  eventId: string;
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Overview', 'home'));
    this.menuItems.push(new MenuItem('Attendees', 'users'));
    this.menuItems.push(new MenuItem('Chat', 'chat'));
    this.menuItems.push(new MenuItem('Comments', 'comments'));
    this.menuItems.push(new MenuItem('Questions', 'help'));
    this.menuItems.push(new MenuItem('Activities', 'pie-chart'));
    this.menuItems.push(new MenuItem('Handouts', 'folder'));
    this.menuItems.push(new MenuItem('Offers', 'shopping-bag'));
    this.menuItems.push(new MenuItem('Reviews', 'star'));
    this.activeMenuItem = this.menuItems[1];
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
      }
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('isHost' in changes) {
      if (this.isHost) {
        this.menuItems.push(new MenuItem('Separator'));
        this.menuItems.push(new MenuItem('Settings', 'sliders'));
      }
    }
  }

  onMenuItemClick(menuItem: MenuItem, e: Event): void {
    e.preventDefault();
    this.activeMenuItem = menuItem;
    this._cdr.detectChanges();
  }
}
