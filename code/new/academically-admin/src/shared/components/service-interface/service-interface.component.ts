import { Component, Injector, ElementRef, ViewChild, Output, Input, ChangeDetectorRef, OnInit, QueryList, ViewChildren, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/app-component-base';
import { EventCategory } from '@shared/service-proxies/service-proxies';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ColorScheme } from '@shared/enums/theme-settings/color-scheme.enum';

export enum InterfaceLayout {
  LeftSidebar,
  RightSidebar,
  TopBar,
  BottomBar,
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
export class ServiceInterfaceComponent extends AppComponentBase implements OnInit, OnChanges {
  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;
  @ViewChildren('attendeeVideos') attendeeVideosEl: QueryList<ElementRef>;

  @Input() model: any;
  @Input() isHost: boolean;
  @Input() eventJoined: boolean;
  @Input() eventStarted: boolean;
  @Input() waiting: boolean;
  @Input() admittedAttendees: any;
  @Input() interfaceMenu: InterfaceMenu[] = [];

  @Output() onExit = new Subject<any>();
  @Output() onSelectMenu = new Subject<InterfaceMenu>();
  @Output() onStartEvent = new Subject<any>();
  @Output() onEndEvent = new Subject<any>();
  @Output() onJoin = new Subject<any>();

  microphoneDisabled = false;
  videoDisabled = false;
  liveStatus = false;
  recordingStatus = false;
  interfaceLayout: InterfaceLayout = InterfaceLayout.RightSidebar;

  selectedInterfaceMenu: InterfaceMenu;
  showAttendees = false;
  themeSettings: IThemeSetting;
  currentTheme: string;

  readonly InterfaceLayout = InterfaceLayout;
  constructor(
    injector: Injector,
    _themeSettingsService: ThemeManagerService,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.themeSettings = _themeSettingsService.getConfiguration();
    this.currentTheme = this.themeSettings.colorScheme.replace('.min.css', '');
  }

  get serviceName(): string { return this.model?.name; }
  get eventCategoryName(): string { return EventCategory[this.model?.category]; }
  get showFeatureContent(): boolean { return !_.isEmpty(this.selectedInterfaceMenu); }
  get selectedFeatureTitle(): string { return this.selectedInterfaceMenu?.name; }
  get totalAttendees(): number { return this.admittedAttendees?.length ?? 0; }
  get isSpotLightView(): boolean { return  this.interfaceLayout === InterfaceLayout.Spotlight; }
  get isVerticalLayout(): boolean { return this.interfaceLayout === (InterfaceLayout.TopBar || InterfaceLayout.BottomBar); }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onExitRoom(): void {
    this.onExit.next();
  }

  onChangeStatus(status: boolean): void {
    this.liveStatus = status;
    if (status) {
      this.onStartEvent.next();
    } else {
      this.onEndEvent.next();
    }
  }

  onChangeRecordingStatus(status: boolean): void {
    this.recordingStatus = status;
  }

  onChangeLayout(layout: InterfaceLayout): void {
    this.interfaceLayout = layout;
    this._cdr.detectChanges();
  }

  onSelectInterfaceMenu(menu: InterfaceMenu, e: any): void {
    e.preventDefault();
    e.stopPropagation();
    if (!_.isEmpty(this.selectedInterfaceMenu) && this.selectedInterfaceMenu.name === menu.name) {
      this.selectedInterfaceMenu = null;
      this.onSelectMenu.next(null);
    } else {
      this.selectedInterfaceMenu = menu;
      this.onSelectMenu.next(menu);
    }
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

  onJoinEvent(): void {
    this.onJoin.next();
  }
}
