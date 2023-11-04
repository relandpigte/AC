import { Component, Injector, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.less']
})
export class ThankYouComponent extends AppComponentBase {
  @Input() serviceId: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _router: Router
  ) {
    super(injector);
  }

  handleClose(): void {
    this._modal.hide();
  }

  async handleGoToReviews(): Promise<void> {
    this._modal.hide();
    await this._router.navigate(['app/coaching', this.serviceId, 'reviews']);
  }
}
