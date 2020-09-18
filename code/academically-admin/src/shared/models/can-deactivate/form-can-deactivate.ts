import { NgForm } from '@angular/forms';
import { ComponentCanDeactivate } from './component-can-deactivate';
import { Injector } from '@angular/core';

export abstract class FormCanDeactive extends ComponentCanDeactivate {
  protected changesNotYetSavedMessage: string;

  constructor(injector: Injector) {
    super(injector);
    this.changesNotYetSavedMessage = this.l('LostChangesWarning');
  }

  abstract get form(): NgForm;

  canDeactivate(): boolean {
    if (this.form.dirty) {
      if (confirm(this.changesNotYetSavedMessage)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
