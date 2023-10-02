import { Component, Injector, Input } from '@angular/core';

import { AppComponentBase } from '@shared/app-component-base';
import { ChannelMessageDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-chat-message-info',
  templateUrl: './chat-message-info.component.html',
  styleUrls: ['./chat-message-info.component.less']
})
export class ChatMessageInfoComponent extends AppComponentBase {
  @Input() channelMessage: ChannelMessageDto;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get channelMessageDelivered(): string { return this.convertMomentToChatDateFormat(this.channelMessage?.creationTime); }
  get channelMessageSeen(): string {
    return this.channelMessage.isSeen ? this.convertMomentToChatDateFormat(this.channelMessage.isSeen) : '–';
  }
}
