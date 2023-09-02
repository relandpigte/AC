import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto } from '@shared/service-proxies/service-proxies';
import { ChannelModel } from '@shared/services/chat.service';
import * as moment from 'moment';
import * as _ from 'lodash';

export enum ChatStatus {
  unread,
  seen,
  unseen
}

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.less']
})
export class RecipientComponent extends AppComponentBase implements OnInit {
  @Input() channel: ChannelDto;
  @Input() isActive = false;

  chatStatus = ChatStatus;

  constructor(
    injector: Injector,
    private _crd: ChangeDetectorRef
  ) {
    super(injector);
  }

  // get chatStatusClass(): any { return this.chatStatus[this.getRndInteger(0, 2)]; }
  get chatStatusClass(): string { return 'seen'; }
  get recipientName(): string { return this.channel?.creatorUser?.fullName ?? 'Unknown User'; }
  get receivedDate(): string { return this.channel?.creationTime ? this.convertMomentToShortDateFormat(moment(this.channel?.creationTime)) : '9:00 am'; }
  get latestMessage(): string {
    if (this.channel?.messages) {
      const message = _.maxBy(this.channel.messages, m => m.creationTime);
      return message.message;
    }
    return 'The quick brown fox jumped over the lazy dog.';
  }

  ngOnInit(): void {
    this._crd.detectChanges();
  }

}
