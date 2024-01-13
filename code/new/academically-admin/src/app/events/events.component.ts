import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { ChatsServiceProxy, EventDto, EventsServiceProxy, ServiceReviewDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [accountModuleAnimation()]
})
export class EventsComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: EventDto;
  review: ServiceReviewDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _serviceData: ServiceDataService,
    private _eventsService: EventsServiceProxy,
    private _chatsService: ChatsServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
    this._serviceData.serviceReview$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.review = x);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`events/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`events/${this.id}`, 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes([`events/${this.id}`, 'reviews'].join('/')); }
  get serviceOwnerId(): number { return this.data?.creatorUser?.id; }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.id = this._route.snapshot.paramMap.get('id');
    this.initServiceData();
  }

  handleEventReview(data: EventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = { data };
    const modal = this._modalService.show(LeaveReviewComponent, modalSettings);

    modal.content.onCloseModal.subscribe((): void => {
      this._modalService.hide();
    });

    modal.content.onReviewSuccess.subscribe((): void => {
      const modalConfirmationSettings = this.defaultModalSettings as ModalOptions<LeaveReviewConfirmationComponent>;
      modalConfirmationSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
      modalConfirmationSettings.initialState = {
        reviewURL: `app/events/${this.id}/reviews`,
        title: this.l('ReviewSubmitted'),
        subTitle: this.l('ThankYouForRating')
      };
      setTimeout((): void => {
        this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
      }, 200);
    });
  }

  private async openMessageModal(): Promise<void> {
    try {
      const channel = await this._chatsService.getChannelByRecipient(this.serviceOwnerId, this.appSession.userId).toPromise();
      const modalSettings = this.defaultModalSettings as ModalOptions<ServiceChatComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-service-chat';
      modalSettings.initialState = {
        channel: channel,
        service: this.data
      };
      const modal = this._modalService.show(ServiceChatComponent, modalSettings);

      modal.content.onClose.subscribe((): void => {
        this._modalService.hide();
      });

      modal.content.onFail.subscribe((): void => {
        this._modalService.hide();
        setTimeout(() => this.openMessageModal(), 200);
      });
    } catch (e) {
      console.error(e);
    }
  }

  private initServiceData(): void {
    forkJoin([
      this._eventsService.get(this.id),
      this._serviceData.getServiceDiscussionId(this.id),
      this._servicesService.getUserReview(this.id),
      this._servicesService.getServiceReviewStats(this.id),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([coaching, discussionId, review, reviewStats]): void => {
        this._serviceData.serviceData = coaching;
        this._serviceData.discussionId = discussionId;
        this._serviceData.serviceReview = review;
        this._serviceData.serviceReviewStats = reviewStats;
      });
  }
}
