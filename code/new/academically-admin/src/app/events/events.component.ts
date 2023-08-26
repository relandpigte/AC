import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComposerConversationComponent } from '@app/chat/_components/composer-conversation/composer-conversation.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [accountModuleAnimation()]
})
export class EventsComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalService: BsModalService
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
  }

  get isAboutTab(): boolean { return this._router.url.includes(['events', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['events', 'discussion'].join('/')); }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
  }

  private openMessageModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ComposerConversationComponent>;
      modalSettings.class = "modal-lg";
      modalSettings.initialState = {
        hasActions: false,
        hasClose: true,
        showAttachmentInfo: false
      };
      const modal = this._modalService.show(ComposerConversationComponent, modalSettings);
      modal.content.onCloseClick
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => modal.hide());
  }
}
