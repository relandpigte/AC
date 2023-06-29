import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from '@shared/modals/confirmation-dialog/confirmation-dialog.component';

export interface ModalDialogOptions {
  title?: string;
  text?: string;
  btnConfirmText?: string;
  btnCancelText?: string;
  confirmCb: () => void;
  cancelCb?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalDialogService {
  private defaultModalSettings = {
    backdrop: 'static',
    ignoreBackdropClick: true,
    keyboard: false,
  };

  constructor(private _modalService: BsModalService) {}

  showConfirmDialog(options: ModalDialogOptions): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ConfirmationDialogComponent>;
    modalSettings.class = 'modal-md modal-dialog-confirmation modal-dialog-centered';
    modalSettings.initialState = {
      title: options.title || 'Confirm',
      text: options.text || 'Are you sure you want to continue?',
      btnConfirmText: options.btnConfirmText || 'Yes',
      btnCancelText: options.btnCancelText || 'Cancel'
    };
    const dialog = this._modalService.show(ConfirmationDialogComponent, modalSettings).content;
    dialog.onConfirmation.subscribe( confirm => {
      if (!confirm && this.isValidFnCallback(options.cancelCb)) {
        options.cancelCb();
      }
      if (confirm && this.isValidFnCallback(options.confirmCb)) {
        options.confirmCb();
      }
    });
  }

  private isValidFnCallback(fn: Function): boolean {
    return fn !== undefined && typeof fn === typeof Function;
  }
}
