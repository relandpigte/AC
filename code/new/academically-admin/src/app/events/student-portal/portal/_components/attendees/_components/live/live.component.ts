import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { EventDto, StudentEventDto, EventsServiceProxy, EventPresenterDto, EventPresenterType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.less']
})
export class LiveComponent extends AppComponentBase implements OnInit {
  model = new EventDto();
  audiences: StudentEventDto[] = [];
  coHosts: EventPresenterDto[] = [];
  guests: EventPresenterDto[] = [];

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
        if (response) {
          this.model = response;
          this.getPresenters();
        }
      });
    this._portalService.audience$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.audiences.push(response);
        }
      });
  }

  private getPresenters(): void {
    this._eventsService.getAllPresenters(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.coHosts = _.filter(responses, response => response.type === EventPresenterType.CoHost);
        this.guests = _.filter(responses, response => response.type === EventPresenterType.Guest);
      });
  }
}
