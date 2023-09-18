import { AfterViewInit, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MessageComposeData } from '@app/chat/chat.component';
import { AppComponentBase } from '@shared/app-component-base';
import {
    ChannelDto,
    ChannelMessageDto,
    ChatsServiceProxy,
    UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ChatService, NotificationType } from '@shared/services/chat.service';
import { ChatComposerComponent } from '@shared/components/chat-composer/chat-composer.component';

@Component({
    selector: 'app-chat-composer-conversation',
    templateUrl: './chat-composer-conversation.component.html',
    styleUrls: ['./chat-composer-conversation.component.less']
})
export class ChatComposerConversationComponent extends AppComponentBase implements OnInit, OnChanges, AfterViewInit {
    @Input() channel: ChannelDto;
    @Input() hasActions = true;
    @Input() hasClose = false;
    @Input() showAttachmentInfo = true;
    @Input() mutedUserChannelIds: string[];

    @Input() replyingTo: ChannelMessageDto;
    @Input() isSearchingUser: boolean;
    @Input() isRecipientTyping = false;
    @Input() blockedByUser: number[];

    @Output() onReplyClick = new EventEmitter();
    @Output() onCloseClick = new EventEmitter();
    @Output() onProcessNotification: EventEmitter<NotificationType> = new EventEmitter<NotificationType>();

    @ViewChild(ChatComposerComponent) composerComponent: ChatComposerComponent;

    blockedUserIds: number[] = [];

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _chatsService: ChatsServiceProxy
    ) {
        super(injector);
    }

    get isUserBlocked(): boolean {
        const blockUser = this.channel?.members?.find(m => m.userId !== this.appSession.userId);
        return this.blockedUserIds?.includes(blockUser?.userId);
    }

    ngOnInit(): void {
        this.getBlockedUsersIds();
    }

    ngOnChanges(): void {
        setTimeout(() => this.focusMessageComposer(), 100);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.focusMessageComposer(), 100);
    }

    handleNotification(type: NotificationType): void {
      this.onProcessNotification.emit(type);
    }

    focusMessageComposer(): void {
        this.composerComponent?.focusMessageComposer();
    }

    handleReplyClick(messageComposeData: MessageComposeData): void {
        this.onReplyClick.emit(messageComposeData);
    }

    handleCloseClick(): void {
        this.onCloseClick.emit();
    }

    handleBlockUser(): void {
        const blockUser = this.channel?.members?.find(m => m.userId !== this.appSession.userId);
        this._userService.blockUserById(blockUser?.userId)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(user => {
              this.blockedUserIds.push(user.blockedUserId);
          });
    }

    handleUnBlockUser(): void {
        const blockUser = this.channel?.members?.find(m => m.userId !== this.appSession.userId);
        this._userService.unblockUserById(blockUser.userId)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(result => {
              if (result) {
                  this.blockedUserIds = this.blockedUserIds.filter(u => u !== blockUser.userId);
              }
          });
    }

    private getBlockedUsersIds(): void {
        if (!this.channel) { return; }

        this.channel?.blockedUsers?.map(user => {
            this.blockedUserIds.push(user.blockedUserId);
        });
    }
}
