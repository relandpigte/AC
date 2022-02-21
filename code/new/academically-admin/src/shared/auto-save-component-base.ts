import { AppComponentBase } from 'shared/app-component-base';
import { Component, Injector, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export abstract class AutoSaveComponentBase extends AppComponentBase implements OnDestroy {
  protected modelToSave: object;
  protected autoSaveCallback: () => void;
  private _autoSaveSub: Subscription;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnDestroy(): void {
    if (this._autoSaveSub) {
      console.log('autosave destroyed!');
      this._autoSaveSub.unsubscribe();
    }
  }

  protected initAutoSave(callback: () => void): void {
    this.autoSaveCallback = callback;
    if (this._autoSaveSub) {
      this._autoSaveSub.unsubscribe();
    }
    let content = JSON.stringify(_.cloneDeep(this.modelToSave));
    console.log('autosave initialzed!');
    this._autoSaveSub = interval(1000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        const newModel = JSON.stringify(this.modelToSave);
        if (content !== newModel) {
          console.log('autosaved!');
          content = newModel;
          this.autoSaveCallback();
        }
      });
  }
}
