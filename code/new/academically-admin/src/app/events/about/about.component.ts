import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto } from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class EventsAboutComponent extends AppComponentBase implements OnInit {
  data: EventDto;

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
