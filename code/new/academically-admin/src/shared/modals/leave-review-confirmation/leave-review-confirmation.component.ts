import { Component, Injector, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-leave-review-confirmation',
  templateUrl: './leave-review-confirmation.component.html',
  styleUrls: ['./leave-review-confirmation.component.less']
})
export class LeaveReviewConfirmationComponent extends AppComponentBase {
  @Input() reviewURL: string;
  @Input() title: string;
  @Input() subTitle: string;

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
    await this._router.navigate([this.reviewURL]);
  }
}
