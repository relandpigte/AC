import { AfterViewInit, Component, EventEmitter, Input, Output, Injector } from '@angular/core';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { TimeZoneDto, TimeZonesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-change-timezone',
  templateUrl: './change-timezone.component.html',
  styleUrls: ['./change-timezone.component.less']
})
export class ChangeTimezoneComponent extends AppComponentBase implements AfterViewInit {
  @Input() timeZones: TimeZoneDto[] = [];
  @Input() userTimeZone: TimeZoneDto;
  @Output() onTimezoneUpdated = new EventEmitter<TimeZoneDto>();

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _timeZonesService: TimeZonesServiceProxy
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToSelected(), 100);
  }

  getTimezoneName(timezone: TimeZoneDto): string {
    const tz = timezone.name.match(/\(([^()]+)\)/g);
    return _.isEmpty(tz) ? null : `${tz[0]} ${timezone.ianaName.replace('_', ' ')}`;
  }

  isTimezoneSelected(id: string): boolean {
    return id === this.userTimeZone?.id;
  }

  scrollToSelected(): void {
    const element = document.querySelector('.timezones-item > a.selected');
    element.scrollIntoView({ behavior: 'smooth' });
  }

  onClickTimezone(tz: TimeZoneDto): void {
    if (_.isEmpty(tz)) { return; }
    this._timeZonesService.updateUserTimeZone(tz)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.onTimezoneUpdated.next(tz);
        this._modal.hide();
      });
  }
}
