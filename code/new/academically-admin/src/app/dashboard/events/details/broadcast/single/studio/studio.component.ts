import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { InvitePresenterComponent } from './_components/invite-presenter/invite-presenter.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { EventPresenterDto, EventsServiceProxy, EventPresenterType, UpdatePresenterTypeDto, EventDto } from '@shared/service-proxies/service-proxies';
import { EventService } from '@app/dashboard/events/_services/event.service';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.less']
})
export class StudioComponent extends AppComponentBase implements OnInit {
  event = new EventDto();
  presenters: EventPresenterDto[] = [];
  eventId: string;
  activeTab = 1;
  loading = false;
  EventPresenterType = EventPresenterType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _eventsService: EventsServiceProxy,
    private _eventService: EventService,
  ) {
    super(injector);
    route.parent.parent.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.eventId = paramMap.get('id');
          this.getPresenters();
        }
      });

    this.pipeDestroy(this._eventService.eventCreated$, (response) => {
      if (response) {
        this.event = response;
      }
    });
  }

  ngOnInit(): void {
  }

  changeActiveTab(value: number) {
    this.activeTab = value;
  }

  onInviteClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<InvitePresenterComponent>;
    modalSettings.initialState = {
      eventId: this.eventId,
    };
    const modal = this._modalService.show(InvitePresenterComponent, modalSettings).content;
    modal.presenterInvited.subscribe(() => {
      this.getPresenters();
    });
  }

  onPresenterTypeChange(type: EventPresenterType, presenter: EventPresenterDto): void {
    if (presenter.type !== type) {
      this.loading = true;
      this._eventsService.updatePresenterType(new UpdatePresenterTypeDto({
        id: presenter.id,
        newType: type,
      }))
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.getPresenters();
        });
    }
  }

  onRemovePresenterClick(presenter: EventPresenterDto): void {
    this.loading = true;
    this._eventsService.removePresenter(presenter.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedRemoved'));
        this.getPresenters();
      });
  }

  onAutoAdmitChange(): void {
    this.pipeDestroy(this._eventsService.updateAutoAdmit(this.eventId,
      this.event.autoAdmitAttendees), () => {
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  private getPresenters(): void {
    this.loading = true;
    this._eventsService.getAllPresenters(this.eventId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(responses => {
        this.presenters = responses;
      });
  }
}
