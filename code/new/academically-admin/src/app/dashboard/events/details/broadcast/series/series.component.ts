import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventDto, EventDto, EventsServiceProxy, EventType, EventStatus } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CreateBroadcastComponent } from '../../../_components/create-broadcast/create-broadcast.component';
import { EventService } from '../../../_services/event.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less'],
  animations: [appModuleAnimation()],
})
export class SeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new EventDto();

  EventStatus = EventStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _eventsService: EventsServiceProxy,
    private _eventService: EventService,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
        this.getEventSeries();
      }
    });
  }

  ngOnInit(): void {
    this._eventService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onAddEventClick(): void {
    const newEvent = new CreateEventDto();
    newEvent.type = EventType.Single;
    newEvent.name = '';
    newEvent.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateBroadcastComponent>;
    modalSettings.initialState = {
      model: newEvent,
    };
    const modal = this._modalService.show(CreateBroadcastComponent, modalSettings).content;
    modal.createBroadcast.subscribe(event => {
      this._eventsService.create(event)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/events/event-series', response.parentId, response.id]);
        });
    });
  }

  onPublishClick(): void {
    this.message.confirm(this.l('PublishEventConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._eventsService.updateStatus(this.model.id, EventStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = EventStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  onUnpublishClick(): void {
    this.message.confirm(this.l('UnpublishEventConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._eventsService.updateStatus(this.model.id, EventStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = EventStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  private getEventSeries(): void {
    this._eventsService.get(this.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._eventService.eventCreated = response;
      });
  }
}
