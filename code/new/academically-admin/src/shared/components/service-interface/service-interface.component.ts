import { Component, Injector, ElementRef, ViewChild, Output, Input, ChangeDetectorRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/app-component-base';
import { EventCategory } from '@shared/service-proxies/service-proxies';

export enum InterfaceLayout {
  LeftSidebar,
  RightSidebar,
  Spotlight,
  Grid,
  Fullscreen
}

export class InterfaceMenu {
  name: string;
  iconLight: string;
  iconDark: string;
  unreadCount: number;

  constructor(name: string, iconLight?: string, iconDark?: string, unreadCount?: number) {
    this.name = name;
    this.iconLight = iconLight;
    this.iconDark = iconDark;
    this.unreadCount = unreadCount;
  }
}

@Component({
  selector: 'app-service-interface',
  templateUrl: './service-interface.component.html',
  styleUrls: ['./service-interface.component.less']
})
export class ServiceInterfaceComponent extends AppComponentBase implements OnInit {
  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;
  @ViewChildren('attendeeVideos') attendeeVideosEl: QueryList<ElementRef>;

  @Input() model: any;
  @Input() admittedAttendees: any;
  @Input() interfaceMenu: InterfaceMenu[] = [];

  @Output() onExit: Subject<any> = new Subject<any>();
  @Output() onSelectMenu: Subject<any> = new Subject<any>();

  microphoneDisabled = false;
  videoDisabled = false;
  liveStatus = false;
  interfaceLayout: InterfaceLayout = InterfaceLayout.RightSidebar;

  selectedInterfaceMenu: InterfaceMenu;
  showAttendees = false;

  readonly InterfaceLayout = InterfaceLayout;
  constructor(injector: Injector, private _cdr: ChangeDetectorRef) {
    super(injector);
  }

  get serviceName(): string { return this.model?.name; }
  get eventCategoryName(): string { return EventCategory[this.model?.category]; }
  get showFeatureContent(): boolean { return !_.isEmpty(this.selectedInterfaceMenu); }
  get selectedFeatureTitle(): string { return this.selectedInterfaceMenu?.name; }

  ngOnInit(): void {
  }

  onExitRoom(): void {
    this.onExit.next();
  }

  onChangeStatus(status: boolean): void {
    this.liveStatus = status;
  }

  onChangeLayout(layout: InterfaceLayout): void {
    this.interfaceLayout = layout;
    this._cdr.detectChanges();
  }

  onSelectInterfaceMenu(menu: InterfaceMenu): void {
    this.selectedInterfaceMenu = menu;
    this.onSelectMenu.next(menu);
  }

  onCloseFeatureContent(): void {
    this.selectedInterfaceMenu = null;
    this.showAttendees = false;
  }

  onToggleAttendees(): void {
    this.showAttendees = !this.showAttendees;
    this.selectedInterfaceMenu = null;

    if (this.showAttendees) {
      this.selectedInterfaceMenu = new InterfaceMenu('Attendees');
      this.onSelectMenu.next(this.selectedInterfaceMenu);
    }
  }
}
