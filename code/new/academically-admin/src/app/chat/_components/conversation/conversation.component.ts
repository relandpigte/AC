import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel, ChatService } from '@app/chat/_services/chat.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit {
  data: ChatModel[] = [];

  constructor(
    injector: Injector,
    private _chatService: ChatService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._chatService.getData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => this.data = response);
  }

}
