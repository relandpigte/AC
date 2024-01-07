import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeZoneDto, UserDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
  selector: 'app-change-timezone',
  templateUrl: './change-timezone.component.html',
  styleUrls: ['./change-timezone.component.less']
})
export class ChangeTimezoneComponent implements AfterViewInit {
  @Input() timeZones: TimeZoneDto[] = [];
  @Input() userData: UserDto;
  @Output() onSelectTimezone = new EventEmitter<TimeZoneDto>();

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToSelected(), 100);
  }

  getTimezoneName(timezone: TimeZoneDto): string {
    const tz = timezone.name.match(/\(([^()]+)\)/g);
    return _.isEmpty(tz) ? null : `${tz[0]} ${timezone.ianaName.replace('_', ' ')}`;
  }

  isTimezoneSelected(id: string): boolean {
    return id === this.userData?.timeZoneId;
  }

  scrollToSelected(): void {
    const element = document.querySelector('.timezones-item > a.selected');
    element.scrollIntoView({ behavior: 'smooth' });
  }

  onClickTimezone(tz: TimeZoneDto): void {
    this.onSelectTimezone.next(tz);
  }
}
