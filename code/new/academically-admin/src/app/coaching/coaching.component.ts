import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { CoachingDto, CoachingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';
import {
  ChatComposerConversationComponent
} from '@shared/components/chat-composer-conversation/chat-composer-conversation.component';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [accountModuleAnimation()]
})
export class CoachingComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: CoachingDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _coachingService: CoachingsServiceProxy,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'reviews'].join('/')); }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.getServiceId();
  }

  private openMessageModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChatComposerConversationComponent>;
      modalSettings.class = 'modal-lg';
      modalSettings.initialState = {
        hasActions: false,
        hasClose: true,
        showAttachmentInfo: false
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
        this._serviceData.serviceData = await this._coachingService.get(this.id).toPromise();
        this._serviceData.discussionId = await this._serviceData.getServiceDiscussionId(this.id);
      }
    });
  }
}
