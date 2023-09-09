import { AfterViewInit, Component, EventEmitter, Injector, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MessageComposeData } from '@app/chat/chat.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChannelMessageDto } from '@shared/service-proxies/service-proxies';
import { ComposerComponent } from '../composer/composer.component';

@Component({
    selector: 'app-composer-conversation',
    templateUrl: './composer-conversation.component.html',
    styleUrls: ['./composer-conversation.component.less']
})
export class ComposerConversationComponent extends AppComponentBase implements OnChanges, AfterViewInit {
    @Input() channel: ChannelDto;
    @Input() hasActions = true;
    @Input() hasClose = false;
    @Input() showAttachmentInfo = true;

    @Input() replyingTo: ChannelMessageDto;
    @Input() isSearchingUser: boolean;
    @Input() isRecipientTyping = false;

    @Output() onReplyClick = new EventEmitter();
    @Output() onCloseClick = new EventEmitter();

    @ViewChild(ComposerComponent) composerComponent: ComposerComponent;

    constructor(
        injector: Injector
    ) {
        super(injector);
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
}
