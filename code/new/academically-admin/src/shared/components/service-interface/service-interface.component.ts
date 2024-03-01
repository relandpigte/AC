import { Component, Injector, ElementRef, ViewChild, Output, Input, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Subject } from 'rxjs';
import { EventCategory } from '@shared/service-proxies/service-proxies';
import { QueryList, ViewChildren } from '@node_modules/@angular/core';

export enum InterfaceLayout {
  LeftSidebar,
  RightSidebar,
  Spotlight,
  Grid,
  Fullscreen
}

@Component({
  selector: 'app-service-interface',
  templateUrl: './service-interface.component.html',
  styleUrls: ['./service-interface.component.less']
})
export class ServiceInterfaceComponent extends AppComponentBase {
  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;
  @ViewChildren('attendeeVideos') attendeeVideosEl: QueryList<ElementRef>;

  @Input() model: any;
  @Input() admittedAttendees: any;
  @Output() onExit: Subject<any> = new Subject<any>();

  microphoneDisabled = false;
  videoDisabled = false;
  liveStatus = false;
  interfaceLayout: InterfaceLayout = InterfaceLayout.RightSidebar;

  readonly InterfaceLayout = InterfaceLayout;
  constructor(injector: Injector, private _cdr: ChangeDetectorRef) {
    super(injector);
  }

  get serviceName(): string { return this.model?.name; }
  get eventCategoryName(): string { return EventCategory[this.model?.category]; }

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
}
