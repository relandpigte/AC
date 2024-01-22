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
  protected intervalMs = 1_000;
  protected isAutoSaving = false;

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
    if (this.isAutoSaving) return;
    this.autoSaveCallback = callback;
    if (this._autoSaveSub) {
      this._autoSaveSub.unsubscribe();
    }
    let content = JSON.stringify(_.cloneDeep(this.modelToSave));
    console.log('autosave initialzed!');
    this.isAutoSaving = true;
    this._autoSaveSub = interval(this.intervalMs)
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
