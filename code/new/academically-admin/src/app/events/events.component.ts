import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { ServiceDataService } from '@shared/services/service-data.service';
import {  ChatsServiceProxy, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChatComposerConversationComponent } from '@shared/components/chat-composer-conversation/chat-composer-conversation.component';
import { RatingComponent } from '@app/events/_components/rating/rating.component';
import { ThankYouComponent } from '@app/events/_components/thank-you/thank-you.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [accountModuleAnimation()]
})
export class EventsComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: EventDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _serviceData: ServiceDataService,
    private _eventsService: EventsServiceProxy,
    private _chatsService: ChatsServiceProxy
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`events/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`events/${this.id}`, 'discussion'].join('/')); }
  get eventOwnerId(): number { return this.data?.creatorUserId; }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.getServiceId();
  }

  handleEventReview(data: EventDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-sm modal-event-rating modal-dialog-centered';
    modalSettings.initialState = { data };

    const modal = this._modalService.show(RatingComponent, modalSettings).content;
    modal.onSuccessReview.subscribe((): void => {
      modalSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
      this._modalService.show(ThankYouComponent, modalSettings);
    });
  }

  private async openMessageModal(): Promise<void> {
    const channel = await this._chatsService.getChannelByRecipient(this.eventOwnerId, this.appSession.userId).toPromise();
    if (channel) {
      this._chatService.replyingToUser$.next(this.data?.creatorUser);
      this._chatService.selectedChannel$.next(channel);
    }

    const modalSettings = this.defaultModalSettings as ModalOptions<ChatComposerConversationComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      hasActions: false,
      hasClose: true,
      showAttachmentInfo: false,
      channel: channel,
      isSearchingUser: false
    };
    const modal = this._modalService.show(ChatComposerConversationComponent, modalSettings);
    modal.content.onCloseClick
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => modal.hide());
  }

  private getServiceId(): void {
    this._route.paramMap.subscribe(async paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this._serviceData.serviceData = await this._eventsService.get(this.id).toPromise();
        this._serviceData.discussionId = await this._serviceData.getServiceDiscussionId(this.id);
      }
    });
  }
}
