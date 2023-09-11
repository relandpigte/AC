import { AfterViewInit, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MessageComposeData } from '@app/chat/chat.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChannelMessageDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ComposerComponent } from '../composer/composer.component';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '@shared/services/chat.service';

@Component({
    selector: 'app-composer-conversation',
    templateUrl: './composer-conversation.component.html',
    styleUrls: ['./composer-conversation.component.less']
})
export class ComposerConversationComponent extends AppComponentBase implements OnInit, OnChanges, AfterViewInit {
    @Input() channel: ChannelDto;
    @Input() hasActions = true;
    @Input() hasClose = false;
    @Input() showAttachmentInfo = true;

    @Input() replyingTo: ChannelMessageDto;
    @Input() isSearchingUser: boolean;
    @Input() isRecipientTyping = false;
    @Input() blockedByUser: number[];

    @Output() onReplyClick = new EventEmitter();
    @Output() onCloseClick = new EventEmitter();

    @ViewChild(ComposerComponent) composerComponent: ComposerComponent;

    selectedChannel: ChannelDto;
    blockedUserIds: number[] = [];

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _chatService: ChatService
    ) {
        super(injector);

        this._chatService.selectedChannel$
          .pipe(takeUntil(this.destroyed$))
          .subscribe(channel => this.selectedChannel = channel);
    }

    get isUserBlocked(): boolean {
        const blockUser = this.selectedChannel?.members.find(m => m.userId !== this.appSession.userId);
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

    focusMessageComposer(): void {
        this.composerComponent.focusMessageComposer();
    }

    handleReplyClick(messageComposeData: MessageComposeData): void {
        this.onReplyClick.emit(messageComposeData);
    }

    handleCloseClick(): void {
        this.onCloseClick.emit();
    }

    handleBlockUser(): void {
        const blockUser = this.selectedChannel?.members.find(m => m.userId !== this.appSession.userId);
        this._userService.blockUserById(blockUser?.userId)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(user => {
              this.blockedUserIds.push(user.blockedUserId);
          });
    }

    handleUnBlockUser(): void {
        const blockUser = this.selectedChannel?.members.find(m => m.userId !== this.appSession.userId);
        this._userService.unblockUserById(blockUser.userId)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(result => {
              if (result) {
                  this.blockedUserIds = this.blockedUserIds.filter(u => u !== blockUser.userId);
              }
          });
    }

    private getBlockedUsersIds(): void {
        if (!this.selectedChannel) { return; }

        this.selectedChannel?.blockedUsers?.map(user => {
            this.blockedUserIds.push(user.blockedUserId);
        });
    }
}
