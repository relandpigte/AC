import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { LandingPagesService } from '@shared/services/landing-pages.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { ChatsServiceProxy, CoachingDto, CoachingsServiceProxy, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [accountModuleAnimation()]
})
export class CoachingComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: CoachingDto;
  rating: number;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _coachingService: CoachingsServiceProxy,
    private _serviceData: ServiceDataService,
    private _ratingService: RatingsServiceProxy,
    private _chatsService: ChatsServiceProxy
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
    this._serviceData.serviceRating$.pipe(takeUntil(this.destroyed$)).subscribe(r => this.rating = r);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'reviews'].join('/')); }
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
        this.id = paramMap.get('id');
        this._serviceData.serviceData = await this._coachingService.get(this.id).toPromise();
        this._serviceData.discussionId = await this._serviceData.getServiceDiscussionId(this.id);
        this._serviceData.serviceRating = await this._ratingService.getUserServiceReview(this.id).toPromise();
      }
    });
  }
}
