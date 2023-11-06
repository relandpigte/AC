import { Component, Injector, Input, Output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { of, Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChatsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import {
  ChatConfirmationType,
  ServiceChatConfirmationComponent
} from '@shared/modals/service-chat/components/service-chat-confirmation/service-chat-confirmation.component';

@Component({
  selector: 'app-service-chat',
  templateUrl: './service-chat.component.html',
  styleUrls: ['./service-chat.component.less']
})
export class ServiceChatComponent extends AppComponentBase {
  @Input() service: any;
  @Input() channel: ChannelDto;
  @Output() onFail = new Subject<any>();
  @Output() onClose = new Subject<any>();

  constructor(
    injector: Injector,
    private _chatsService: ChatsServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  get recipient(): UserDto { return this.service?.creatorUser; }
  get recipientProfile(): string { return this.getProfilePictureUrl(this.recipient?.profilePictureDocument); }
  get recipientName(): string { return this.recipient.fullName; }
  get messageTo(): string { return this.l('MessageTo', this.recipient?.name); }
  get serviceName(): string { return this.service?.name; }

  async handleSubmit(form: NgForm): Promise<void> {
    this._chatsService.createChannelMessage(
      form.value.message,
      this.recipient.id,
      undefined,
      this.service.id,
      this.channel.id ?? undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): void => this.onCloseModal()))
      .pipe(catchError(error => of(`Bad Promise: ${error}`)))
      .subscribe(response => {
        if (typeof response === 'string') {
          setTimeout((): void => this.onFailModal(), 200);
        } else {
          setTimeout((): void => this.onSuccessModal(), 200);
          // TODO: For demo purposes, always go to error popup.
          // setTimeout((): void => this.onFailModal(), 200);
        }
      });
  }

  onCloseModal(): void {
    this.onClose.next();
  }

  onSuccessModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ServiceChatConfirmationComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-service-chat-confirmation';
    modalSettings.initialState = {
      title: this.l('MessageSent'),
      content: this.l('MessageSentDesc', this.recipientName),
      buttonText: this.l('Done'),
      type: ChatConfirmationType.success
    };
    const modal = this._modalService.show(ServiceChatConfirmationComponent, modalSettings);

    modal.content.onAction.subscribe((): void => {
      this._modalService.hide(modal.id);
    });
  }

  onFailModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ServiceChatConfirmationComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-service-chat-confirmation';
    modalSettings.initialState = {
      title: this.l('MessageNotSent'),
      content: this.l('MessageNotSentDesc', this.recipientName),
      buttonText: this.l('TryAgain'),
      type: ChatConfirmationType.fail
    };
    const modal = this._modalService.show(ServiceChatConfirmationComponent, modalSettings);

    modal.content.onAction.subscribe((): void => {
      this.onFail.next();
    });
  }
}
