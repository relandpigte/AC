import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import {
  CoachingDto,
  CoachingStatus,
  EventCategory,
  EventDto,
  EventsServiceProxy,
  EventStatus,
  EventType, ScheduledServiceType
} from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { forkJoin } from '@node_modules/rxjs';

type CreatedTab = 'upcoming' | 'past' | 'draft' | 'cancelled';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  upcomingEvents: EventDto[] = [];
  pastEvents: EventDto[] = [];
  cancelledEvents: EventDto[] = [];
  draftEvents: EventDto[] = [];

  isLoading = true;
  shimmerType = ShimmerType;

  activeTab: CreatedTab = 'upcoming';
  readonly CoachingStatus = CoachingStatus;
  readonly EventStatus = EventStatus;
  protected readonly fns = {
    [EventStatus.Draft]: 'draftEvents',
    [EventStatus.Published]: 'upcomingEvents',
  };
  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _eventsService: EventsServiceProxy,
    private _router: Router,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalUpcomingEvents(): number { return this.upcomingEvents?.length; }
  get totalPastEvents(): number { return this.pastEvents?.length; }
  get totalCancelledEvents(): number { return this.cancelledEvents?.length; }
  get totalDraftEvents(): number { return this.draftEvents?.length; }

  ngOnInit(): void {
    this.initEvents();
  }

  async handleJoinClick(id: string): Promise<void> {
    await this._router.navigate(['app/dashboard/events/portal/broadcast/student', id, 'portal']);
  }

  onEditClick(data: EventDto) {
    const eventCategory = () => {
      if (data.category === EventCategory.Broadcast) return '/broadcast';
      return '/workshop';
    }

    const eventType = () => {
      if (data.type === EventType.Series) return '/series';
      return '';
    }

    this._router.navigate([`/app/dashboard/events${eventCategory()}${eventType()}`, data.id]);
  }

  onDuplicateClick(id: string) {
    this._eventsService.duplicate(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.initEvents();
        this.notify.success(this.l('Generics.SuccessfullyDuplicated'));
      });
  }

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('Generics.DeleteConfirmationMessageWithType', ['event']),
      confirmCb: (): void => {
        this._eventsService.delete(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.initEvents();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUpdateStatus(data: EventDto, changeToStatus: EventStatus): void {
    const { id, status } = data;
    const service = this[this.fns[status]]?.find(x => x.id === id);
    if (!service) {
      return;
    }
    this._eventsService.updateStatus(id, changeToStatus)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        this[this.fns[status]] = this[this.fns[status]]?.filter(x => x.id !== id);
        service.status = changeToStatus;
        this[this.fns[changeToStatus]].push(service);
      });
  }

  async onRedirection(event: EventDto): Promise<void> {
    this._router.navigate(['app/events' , event.id, 'about']);
  }

  private initEvents(): void {
    this._dashboardPageService.setIsLoading(true);
    forkJoin([
      this._eventsService.getCreatedEventsByUser(ScheduledServiceType.Upcoming),
      this._eventsService.getCreatedEventsByUser(ScheduledServiceType.Past),
      this._eventsService.getCreatedEventsByUser(ScheduledServiceType.Draft),
    ])
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.setIsLoading(false)))
      .subscribe(([upcoming, past, draft]): void => {
        this.upcomingEvents = upcoming;
        this.pastEvents = past;
        this.draftEvents = draft;
      });
  }
}
