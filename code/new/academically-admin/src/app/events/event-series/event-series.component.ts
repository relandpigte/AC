import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventDto, EventDto, EventsServiceProxy, EventType } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CreateEventComponent } from '../_components/create-event/create-event.component';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-series',
  templateUrl: './event-series.component.html',
  styleUrls: ['./event-series.component.less'],
  animations: [appModuleAnimation()],
})
export class EventSeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new EventDto();

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
    newEvent.type = EventType.SingleEvent;
    newEvent.name = '';
    newEvent.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEventComponent>;
    modalSettings.initialState = {
      model: newEvent,
    };
    const modal = this._modalService.show(CreateEventComponent, modalSettings).content;
    modal.createEvent.subscribe(event => {
      this._eventsService.create(event)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/events/event-series', response.parentId, response.id]);
        });
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
