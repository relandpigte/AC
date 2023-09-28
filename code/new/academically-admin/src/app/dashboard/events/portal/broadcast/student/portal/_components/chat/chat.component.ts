import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MessageComposeData } from '@app/chat/chat.component';

@Component({
  selector: 'app-sidebar-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleOnReply(message: MessageComposeData): void {
    console.log(message);
  }
}
