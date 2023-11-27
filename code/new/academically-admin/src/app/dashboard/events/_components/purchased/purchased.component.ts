import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { EventCategory, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';


@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  upcomingEvents: EventDto[] = [];
  pastEvents: EventDto[] = [];
  cancelledEvents: EventDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dashboardPageService: DashboardPagesService,
    private _eventsService: EventsServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalUpcomingEvents(): number { return this.upcomingEvents?.length; }
  get totalPastEvents(): number { return this.pastEvents?.length; }
  get totalCancelledEvents(): number { return this.cancelledEvents?.length; }

  ngOnInit(): void {
    this.initStudentEvents();
  }

  async handleJoinClick(id: string): Promise<void> {
    await this._router.navigate(['app/dashboard/events/portal/broadcast/student', id, 'portal']);
  }

  private initStudentEvents(): void {
    this._dashboardPageService.setIsLoading(true);
    this._eventsService.getEnrolledEventsByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.setIsLoading(false)))
      .subscribe(events => {
        this.upcomingEvents = events?.filter(e => moment().isBefore(e.eventDateTime) && e.status !== 0);
        this.pastEvents = events?.filter(e => moment().isAfter(e.eventDateTime));
      });
  }

  onPurchaseClick(event: EventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: event };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.initStudentEvents());
  }

  async onRedirection(event: EventDto): Promise<void> {
    this._router.navigate(['app/events' , event.id, 'about']);
  }
}
