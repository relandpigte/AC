import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { MessageComposeData } from '@app/chat/chat.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChannelMessageDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-composer-conversation',
    templateUrl: './composer-conversation.component.html',
    styleUrls: ['./composer-conversation.component.less']
})
export class ComposerConversationComponent extends AppComponentBase {
    @Input() channel: ChannelDto;
    @Input() hasActions = true;
    @Input() hasClose = false;
    @Input() showAttachmentInfo = true;

    @Input() replyingTo: ChannelMessageDto;
    @Input() isSearchingUser: boolean;
    @Input() isRecipientTyping = false;

    @Output() onReplyClick = new EventEmitter();
    @Output() onCloseClick = new EventEmitter();

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    handleReplyClick(messageComposeData: MessageComposeData): void {
        this.onReplyClick.emit(messageComposeData);
    }

    handleCloseClick(): void {
        this.onCloseClick.emit();
    }
}
