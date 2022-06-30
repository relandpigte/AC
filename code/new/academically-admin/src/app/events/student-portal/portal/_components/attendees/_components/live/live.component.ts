import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { EventDto, StudentEventDto, EventPresenterDto, EventPresenterType, EventUserDto, EventUserType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.less']
})
export class LiveComponent extends AppComponentBase implements OnInit {
  @Input() isHost = true;
  @Input() controlsEnabled = false;
  model = new EventDto();
  audiences: EventUserDto[] = [];
  coHosts: EventUserDto[] = [];
  guests: EventUserDto[] = [];

  constructor(
    injector: Injector,
    private _portalService: PortalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.model = response;
        }
      });
    this._portalService.attendeeJoined$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          switch (response.type) {
            case EventUserType.Audience:
              this.audiences.push(response);
              break;
            case EventUserType.CoHost:
              this.coHosts.push(response);
              break;
            case EventUserType.Guest:
              this.guests.push(response);
              break;
          }
        }
      });
    this._portalService.grantedRequestToSpeak$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.controlsEnabled = true;
        }
      });
  }
}
