import { Component, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.less']
})
export class ThankYouComponent extends AppComponentBase {

  constructor(
    injector: Injector,
    private _modal: BsModalRef
  ) {
    super(injector);
  }

  handleClose(): void {
    this._modal.hide();
  }
}
