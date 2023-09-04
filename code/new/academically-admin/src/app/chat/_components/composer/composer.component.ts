import { Component, ElementRef, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageComposeData } from '@app/chat/chat.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelMessageDto } from '@shared/service-proxies/service-proxies';
import { ChatService } from '@shared/services/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.less']
})
export class ComposerComponent extends AppComponentBase implements OnInit {
  @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;

  @Input() replyingTo: ChannelMessageDto;
  @Output() onReply: Subject<MessageComposeData> = new Subject();

  typingTimer$: any;

  constructor(
    injector: Injector,
    private _chatService: ChatService
  ) {
    super(injector);

    this._chatService.replyToMessage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(replyingTo => {
        this.replyingTo = replyingTo;
        this.messageInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
        this.messageInput.nativeElement.focus();
      });
  }

  get replyingToRecipient(): string { return this.replyingTo?.creatorUser?.name ?? 'Miyah'; }
  get replyingToMessage(): string { return this.replyingTo?.message ?? 'I can even begin to express how good this final season'; }

  ngOnInit(): void {
  }

  handleWriteMessage(f: NgForm): void {
    if (f.value.message === '') {
      return;
    }
    this.onReply.next({
      parentId: this.replyingTo?.id,
      message: f.value.message
    });
    f.resetForm();
  }

  handleRemoveReplyTo(): void {
    this._chatService.replyToMessage$.next(null);
  }

  onMessageKeydown(event: any, f: NgForm): void {
    if (event.keyCode === 13 && !!f.value.message?.trim()) {
      f.ngSubmit.emit();
      event.preventDefault();
    } else if (event.keyCode === 27) {
      // Escape - exit writing a message
    } else {
      this.reportTyping();
    }
  }

  private reportTyping(): void {
    this._chatService.userTyping$.next(true);
    if (this.typingTimer$) clearTimeout(this.typingTimer$);
    this.typingTimer$ = setTimeout(() => this._chatService.userTyping$.next(false), 1000);
  }
}
