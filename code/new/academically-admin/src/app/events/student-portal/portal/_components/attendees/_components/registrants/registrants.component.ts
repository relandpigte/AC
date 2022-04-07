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
  event: EventDto;
  audiences: StudentEventDto[] = [];

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.event = response;
        this.getAllAudiences();
      });
    this._portalService.audience$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          const index = this.audiences.findIndex(e => e.id === response.id);
          console.log(index);
          if (index > -1) {
            this.audiences.splice(index, 1);
          }
        }
      });
  }

  private getAllAudiences(): void {
    this._eventsService.getAllAudiences(this.event.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        console.log(responses);
        this.audiences = responses;
      });
  }
}
