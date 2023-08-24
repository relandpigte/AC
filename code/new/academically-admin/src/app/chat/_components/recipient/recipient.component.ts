import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

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
  @Input() isActive: boolean;

  chatStatus = ChatStatus;

  constructor(
    injector: Injector,
    private _crd: ChangeDetectorRef
  ) {
    super(injector);
  }

  get chatStatusClass(): any { return this.chatStatus[this.getRndInteger(0, 2)]; }

  ngOnInit(): void {
  }

}
