import { HostListener, Injector } from '@angular/core';
import { AppComponentBase } from '../../app-component-base';

export abstract class ComponentCanDeactivate extends AppComponentBase {
  constructor(injector: Injector) {
    super(injector);
  }

  abstract canDeactivate(): boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}
