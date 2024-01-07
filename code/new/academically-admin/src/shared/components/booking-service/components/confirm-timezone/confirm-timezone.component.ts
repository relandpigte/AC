import * as _ from 'lodash';
import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { TimeZoneDto, TimeZonesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-confirm-timezone',
  templateUrl: './confirm-timezone.component.html',
  styleUrls: ['./confirm-timezone.component.less']
})
export class ConfirmTimezoneComponent extends AppComponentBase {
  @Input() timezone: TimeZoneDto;
  @Output() onTimezoneUpdated = new EventEmitter<TimeZoneDto>();

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _timeZonesService: TimeZonesServiceProxy
  ) {
    super(injector);
  }

  onChangeTimezone(): void {
    if (_.isEmpty(this.timezone)) { return; }
    this._timeZonesService.updateUserTimeZone(this.timezone)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.onTimezoneUpdated.next(this.timezone);
        this.onCloseModal();
      });
  }

  onCloseModal(): void {
    this._modal.hide();
  }
}
