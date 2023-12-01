import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { ChatsServiceProxy, CourseDto, CoursesServiceProxy, RatingsServiceProxy, ServiceReviewDto, ServiceReviewStats, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less'],
  animations: [accountModuleAnimation()]
})
export class CourseComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: CourseDto;
  review: ServiceReviewDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _serviceData: ServiceDataService,
    private _courseService: CoursesServiceProxy,
    private _chatsService: ChatsServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.data = x);
    this._serviceData.serviceReview$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.review = x);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`course/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`course/${this.id}`, 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes([`course/${this.id}`, 'reviews'].join('/')); }
  get serviceOwnerId(): number { return this.data?.creatorUser?.id; }
  get serviceId(): string { return this.data?.id; }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.initServiceData();
  }

  onReview(data: any): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = { data };
    const modal = this._modalService.show(LeaveReviewComponent, modalSettings);

    modal.content.onCloseModal.subscribe((): void => {
      this._modalService.hide();
    });

    modal.content.onReviewSuccess.subscribe((): void => {
      setTimeout((): void => {
        const modalConfirmationSettings = this.defaultModalSettings as ModalOptions<LeaveReviewConfirmationComponent>;
        modalConfirmationSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
        modalConfirmationSettings.initialState = {
          reviewURL: `app/course/${this.serviceId}/reviews`,
          title: this.l('ReviewSubmitted'),
          subTitle: this.l('ThankYouForReviewing')
        };
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
    this._route.paramMap.subscribe(async paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        forkJoin([
          this._courseService.get(this.id),
          this._serviceData.getServiceDiscussionId(this.id),
          this._servicesService.getUserReview(this.id),
          this._servicesService.getServiceReviewStats(this.id),
        ])
          .pipe(takeUntil(this.destroyed$))
          .subscribe(([course, discussionId, review, reviewStats]): void => {
            this._serviceData.serviceData = course;
            this._serviceData.discussionId = discussionId ;
            this._serviceData.serviceReview = review;
            this._serviceData.serviceReviewStats = reviewStats;
          });
      }
    });
  }
}
