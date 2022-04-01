import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto, EventsServiceProxy, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EventStartingComponent } from './_components/event-starting/event-starting.component';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less'],
  animations: [appModuleAnimation()],
})
export class PortalComponent extends AppComponentBase implements OnInit {
  model = new EventDto;
  eventId: string;
  preview = false;
  showSidebar = true;
  showDeviceSettings = false;
  eventStarted = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _modalService: BsModalService,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        this.getEvent();
      }
    });
  }

  ngOnInit(): void {
  }

  onExitClick(): void {
    if (this.preview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/home/events']);
    }
  }

  onGoLiveClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<EventStartingComponent>;
    const modal = this._modalService.show(EventStartingComponent, modalSettings).content;
    modal.eventStarted.pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.eventStarted = response;
      });
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
      });
  }
}
