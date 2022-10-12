import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { EventDto, EventsServiceProxy, EventStatus } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '../../../_services/event.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new EventDto();
  isLoading = false;
  EventStatus = EventStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _eventService: EventService,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getEvent();
    this._eventService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onLessonPreviewClick(): void {
    const url = `${AppConsts.appBaseUrl}/app/lesson-preview/${this.id}`;
    window.open(url, '_blank');
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

  private getEvent(): void {
    this._eventsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._eventService.eventCreated = response;
      });
  }
}
