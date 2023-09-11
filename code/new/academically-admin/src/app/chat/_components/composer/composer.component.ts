import { Component, ElementRef, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MessageComposeData } from '@app/chat/chat.component';
import { AppComponentBase } from '@shared/app-component-base';
import { AvailableServiceDto, ChannelDto, ChannelMessageDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChatService } from '@shared/services/chat.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileUtils } from '@shared/helpers/file-utils';
import { AddServiceComponent } from '@shared/modals/add-service/add-service.component';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.less']
})
export class ComposerComponent extends AppComponentBase implements OnInit{
  @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  @Input() replyingTo: ChannelMessageDto;
  @Input() isUserBlocked: boolean;
  @Input() blockedByUser: number[];
  @Output() onReply: Subject<MessageComposeData> = new Subject();
  @Output() onUnblock: Subject<any> = new Subject<any>();

  typingTimer$: any;
  selectedService: AvailableServiceDto;
  isShowServicePicker = false;
  fileAttachment: File;
  allowedExtensions: string[] = [];
  selectedChannel: ChannelDto;
  blockedUserIds: number[] = [];

  private maxFileSize = fileUploadConfiguration.maxFileSize;
  private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
  private videoExtensions = fileUploadConfiguration.videoExtensions;
  private fileExtensions = fileUploadConfiguration.allowedFileExtensions;

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _modalService: BsModalService,
    private _userService: UserServiceProxy
  ) {
    super(injector);

    this._chatService.replyToMessage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(replyingTo => {
        this.replyingTo = replyingTo;
        this.messageInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
        this.messageInput.nativeElement.focus();
      });

    this._chatService.fileAttachment$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(file => this.fileAttachment = file);

    this._chatService.selectedService$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(service => this.selectedService = service);

    this._chatService.selectedChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => this.selectedChannel = channel);
  }

  get replyingToRecipient(): string { return this.replyingTo?.creatorUser?.name ?? 'Miyah'; }
  get replyingToMessage(): string { return this.replyingTo?.message ?? 'I can even begin to express how good this final season'; }
  get isShowAddService(): boolean { return this.isTutor; }
  get hasAttachments(): boolean { return !!this.fileAttachment || !!this.selectedService; }
  get isBlockedByRecipient(): boolean {
    const blockByRecipient = this.selectedChannel?.members.find(m => m.userId !== this.appSession.userId);
    return this.blockedByUser?.includes(blockByRecipient?.userId);
  }

  ngOnInit(): void {
    this.getBlockedUsersIds();
  }

  handleUnBlockUser(): void {
    this.onUnblock.next();
  }

  focusMessageComposer(): void {
    this.messageInput?.nativeElement?.focus();
  }

  handleWriteMessage(f: NgForm): void {
    this.onReply.next({
      parentId: this.replyingTo?.id,
      message: f.value.message
    });
    f.resetForm();

    this.selectedService = null;
    this.fileAttachment = null;
  }

  handleRemoveReplyTo(): void {
    this._chatService.replyToMessage$.next(null);
  }

  onMessageKeydown(event: any, f: NgForm): void {
    if (event.keyCode === 13) {
      f.ngSubmit.emit();
      event.preventDefault();
    } else if (event.keyCode === 27) {
      // Escape - exit writing a message
    } else {
      this.reportTyping();
    }
  }

  handleImageUploadBtnClick(e: Event): void {
    e.preventDefault();
    this.allowedExtensions = [...this.imageExtensions, ...this.videoExtensions];
    setTimeout(() => {
      this.fileInput.nativeElement.click();
    });
  }

  handleFileUploadBtnClick(e: Event): void {
    e.preventDefault();
    this.allowedExtensions = this.fileExtensions;
    setTimeout(() => {
      this.fileInput.nativeElement.click();
    });
  }

  onFileChange(e: any): void {
    const file = e.target.files[0] as File;
    if (FileUtils.validateFile(this, [file], this.maxFileSize, 1, this.allowedExtensions)) {
      this._chatService.fileAttachment$.next(file);
      this._chatService.sanitizedAttachmentUrl$.next(FileUtils.getSanitizedFileUrl(this, file));
    }
    this.fileInput.nativeElement.value = '';
    this.messageInput.nativeElement.focus();
  }

  handleRemoveAttachment(): void {
    this._chatService.fileAttachment$.next(null);
    this.fileInput.nativeElement.value = '';
  }

  handleRemoveSelectedService(): void {
    this._chatService.selectedService$.next(null);
  }

  toggleServicePicker(e: Event): void {
    e.preventDefault();
    this.isShowServicePicker = !this.isShowServicePicker;
    if (!this.isShowServicePicker) {
      return;
    }

    const modalSettings = this.defaultModalSettings as ModalOptions<AddServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { selectedService: this.selectedService };

    const modal = this._modalService.show(AddServiceComponent, modalSettings).content;
    modal.onAdd.subscribe((service: any) => this.handleOnAddService(service));
  }

  private handleOnAddService(service: AvailableServiceDto): void {
    this._chatService.selectedService$.next(service);
    this.isShowServicePicker = false;
    this.messageInput.nativeElement.focus();
  }

  private reportTyping(): void {
    this._chatService.userTyping$.next(true);
    if (this.typingTimer$) {
      clearTimeout(this.typingTimer$);
    }
    this.typingTimer$ = setTimeout(() => this._chatService.userTyping$.next(false), 1000);
  }

  private getBlockedUsersIds(): void {
    if (!this.selectedChannel) { return; }

    this.selectedChannel?.blockedUsers?.map(user => {
      this.blockedUserIds.push(user.blockedUserId);
    });
  }
}
