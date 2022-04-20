import { Component, OnInit, Injector } from '@angular/core';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { StudentEventDto, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.less']
})
export class RegistrantsComponent extends AppComponentBase implements OnInit {
  audiences: StudentEventDto[] = [];

  constructor(
    injector: Injector,
    private _portalService: PortalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._portalService.audiences$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.audiences = responses;
      });
  }
}
