import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class CourseAboutComponent extends AppComponentBase implements OnInit {
  data: CourseDto;

  constructor(
    injector: Injector,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => this.data = data);
  }
}
