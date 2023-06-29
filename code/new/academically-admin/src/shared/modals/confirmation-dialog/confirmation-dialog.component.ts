import { Component, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '../../app-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent extends AppComponentBase {
  @Input() title: string;
  @Input() text: string;
  @Input() btnConfirmText: string;
  @Input() btnCancelText: string;

  @Output() onConfirmation: Subject<boolean> = new Subject<boolean>();

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  onCancel(): void {
    this.onConfirmation.next(false);
    this._modal.hide();
  }

  onConfirm(): void {
    this.onConfirmation.next(true);
    this._modal.hide();
  }
}
