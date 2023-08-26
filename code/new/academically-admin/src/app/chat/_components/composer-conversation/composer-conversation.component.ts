import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel, ChatService } from '@shared/services/chat.service';

@Component({
    selector: 'app-composer-conversation',
    templateUrl: './composer-conversation.component.html',
    styleUrls: ['./composer-conversation.component.less']
})
export class ComposerConversationComponent extends AppComponentBase {
    @Input() hasActions = true;
    @Input() hasClose = false;
    @Input() showAttachmentInfo = true;

    @Input() replyingTo: ChatModel;

    @Output() onReplyClick = new EventEmitter();
    @Output() onCloseClick = new EventEmitter();

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    handleReplyClick(): void {
        this.onReplyClick.emit();
    }

    handleCloseClick(): void {
        this.onCloseClick.emit();
    }
}
