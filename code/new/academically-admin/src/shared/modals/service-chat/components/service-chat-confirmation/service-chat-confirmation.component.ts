import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Subject } from 'rxjs';

export enum ChatConfirmationType {
  success = 'success',
  fail = 'fail'
}
@Component({
  selector: 'app-service-chat-confirmation',
  templateUrl: './service-chat-confirmation.component.html',
  styleUrls: ['./service-chat-confirmation.component.less']
})
export class ServiceChatConfirmationComponent extends AppComponentBase implements OnInit {
  @Input() title: string;
  @Input() content: string;
  @Input() buttonText: string;
  @Input() type: ChatConfirmationType;
  @Output() onAction = new Subject<any>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleOnAction(): void {
    this.onAction.next();
  }
}
