import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { ServiceDataService } from '@shared/services/service-data.service';
import { RatingComponent } from '@app/events/_components/rating/rating.component';
import { ThankYouComponent } from '@app/events/_components/thank-you/thank-you.component';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { ChatsServiceProxy, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';

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
  get serviceOwnerId(): number { return this.data?.creatorUser?.id; }

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
          this._serviceData.serviceData = await this._eventsService.get(this.id).toPromise();
          this._serviceData.discussionId = await this._serviceData.getServiceDiscussionId(this.id);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}
