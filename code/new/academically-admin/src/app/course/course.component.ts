import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { ChatsServiceProxy, CourseDto, CoursesServiceProxy, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less'],
  animations: [accountModuleAnimation()]
})
export class CourseComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: CourseDto;
  rating: number;

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
    private _ratingService: RatingsServiceProxy
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
    this._serviceData.serviceRating$.pipe(takeUntil(this.destroyed$)).subscribe(r => this.rating = r);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`course/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`course/${this.id}`, 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes([`course/${this.id}`, 'reviews'].join('/')); }
  get serviceOwnerId(): number { return this.data?.creatorUser?.id; }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.getServiceId();
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

  private getServiceId(): void {
    this._route.paramMap.subscribe(async paramMap => {
      if (paramMap.has('id')) {
        try {
          this.id = paramMap.get('id');
          this._serviceData.serviceData = await this._courseService.get(this.id).toPromise();
          this._serviceData.discussionId = await this._serviceData.getServiceDiscussionId(this.id);
          this._serviceData.serviceRating = await this._ratingService.getUserServiceReview(this.id).toPromise();
          this._serviceData.serviceOverallRating = await this._ratingService.getServiceRatingsSummary(this.id).toPromise();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}
