import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ChatComposerConversationComponent } from '@shared/components/chat-composer-conversation/chat-composer-conversation.component';
import {
  ChatsServiceProxy,
  CourseDto,
  CoursesServiceProxy,
  RatingsServiceProxy
} from '@shared/service-proxies/service-proxies';

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
  get eventOwnerId(): number { return this.data?.creatorUser?.id; }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.getServiceId();
  }

  private async openMessageModal(): Promise<void> {
    const channel = await this._chatsService.getChannelByRecipient(this.eventOwnerId, this.appSession.userId).toPromise();
    this._chatService.replyingToUser$.next(this.data?.creatorUser);
    this._chatService.selectedChannel$.next(channel);

    const modalSettings = this.defaultModalSettings as ModalOptions<ChatComposerConversationComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      hasActions: false,
      hasClose: true,
      showAttachmentInfo: false,
      channel: !!channel.id ? channel : null,
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
        try {
          this.id = paramMap.get('id');
          this._serviceData.serviceData = await this._courseService.get(this.id).toPromise();
          this._serviceData.discussionId = await this._serviceData.getServiceDiscussionId(this.id);
          this._serviceData.serviceRating = await this._ratingService.getUserServiceReview(this.id).toPromise();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}
