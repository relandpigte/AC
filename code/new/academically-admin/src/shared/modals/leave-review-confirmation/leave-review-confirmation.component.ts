import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
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
  @Input() hasGoToReviews: boolean = true;
  @Input() hasDone: boolean = true;

  @Output() onGoToReviews = new EventEmitter<any>();
  @Output() onDone = new EventEmitter<any>();

  get hasActionButtons(): boolean { return this.hasGoToReviews || this.hasDone; }
  get isDefaultGoToReviews(): boolean { return this.onGoToReviews.observers?.length === 0; }
  get isDefaultDone(): boolean { return this.onDone.observers?.length === 0; }

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
    if (this.isDefaultGoToReviews && this.reviewURL) {
      await this._router.navigate([this.reviewURL]);
    } else if (this.onGoToReviews.observers.length > 0) {
      this.onGoToReviews.emit();
    }
  }

  async handleDone(): Promise<void> {
    this._modal.hide();
    if (this.isDefaultDone) {
      return;
    } else if (this.onDone.observers.length > 0) {
      this.onDone.emit();
    }
  }
}
