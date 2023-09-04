import { Component, Injector, Input } from '@angular/core';

import { AppComponentBase } from '@shared/app-component-base';
import { ChannelMessageDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-message-info',
  templateUrl: './message-info.component.html',
  styleUrls: ['./message-info.component.less']
})
export class MessageInfoComponent extends AppComponentBase {
  @Input() channelMessage: ChannelMessageDto;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get channelMessageDelivered(): string { return this.convertMomentToDateAgo(this.channelMessage?.creationTime); }
  get channelMessageSeen(): string {
    return this.channelMessage.isSeen ? this.convertMomentToDateAgo(this.channelMessage.isSeen) : '–';
  }
}
