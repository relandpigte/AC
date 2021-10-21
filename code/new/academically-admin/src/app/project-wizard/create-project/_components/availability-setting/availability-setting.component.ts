import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditAvailabilityComponent } from '../create-edit-availability/create-edit-availability.component';
import { DayOfWeek } from '@shared/service-proxies/service-proxies';
import { Availability } from '../../_models/availability';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-availability-setting',
  templateUrl: './availability-setting.component.html',
  styleUrls: ['./availability-setting.component.less']
})
export class AvailabilitySettingComponent extends AppComponentBase implements OnInit {
  DayOfWeek = DayOfWeek;
  availabilities: Availability[] = [];

  constructor(
    injector: Injector,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings;
    const modalRef = this._modalService.show(CreateEditAvailabilityComponent, modalSettings);
    const modal: CreateEditAvailabilityComponent = modalRef.content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(availabilities => {
        if (!this.availabilities.length) {
          this.availabilities = availabilities;
        } else {
          _.forEach(availabilities, availability => {
            const index = this.availabilities.findIndex(e => e.dayOfWeek === availability.dayOfWeek);
            if (index < 0) {
              this.availabilities.push(availability);
            } else {
              this.availabilities[index].times.push(...availability.times);
              this.availabilities[index].times = _.sortBy(this.availabilities[index].times, e => e.startTime);
            }
          });
          this.availabilities = _.sortBy(this.availabilities, e => e.dayOfWeek);
        }
      });
  }
}
