import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelModel } from '@shared/services/chat.service';
import * as moment from 'moment';

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
  @Input() channel: ChannelModel;
  chatStatus = ChatStatus;

  constructor(
    injector: Injector,
    private _crd: ChangeDetectorRef
  ) {
    super(injector);
  }

  // get chatStatusClass(): any { return this.chatStatus[this.getRndInteger(0, 2)]; }
  get isActive(): boolean { return this.channel?.isActive }
  get chatStatusClass(): string { return 'seen'; }
  get recipientName(): string { return this.channel?.creatorUser?.fullName ?? 'Unknown User'; }
  get receivedDate(): string { return this.channel?.creationTime ? this.convertMomentToShortDateFormat(moment(this.channel?.creationTime)) : '9:00 am'; }
  get latestMessage(): string { return this.channel?.latestMessage ?? 'The quick brown fox jumped over the lazy dog.'; }

  ngOnInit(): void {
    this._crd.detectChanges();
  }

}
