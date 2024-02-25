import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
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
    this.pipeDestroy(this._portalService.event$, event => {
      if (event) {
        this.model = event;
      }
    });

    this.pipeDestroy(this._portalService.attendeeJoined$, user => {
      if (user) {
        switch (user.type) {
          case EventUserType.Audience:
            this.audiences.push(user);
            break;
          case EventUserType.CoHost:
            this.coHosts.push(user);
            break;
          case EventUserType.Guest:
            this.guests.push(user);
            break;
        }
      }
    });

    this.pipeDestroy(this._portalService.attendeeLeft$, user => {
      if (user) {
        switch (user.type) {
          case EventUserType.Audience:
            this.audiences = this.audiences.filter(e => e.user.id !== user.user.id);
            break;
          case EventUserType.CoHost:
            this.coHosts = this.coHosts.filter(e => e.user.id !== user.user.id);
            break;
          case EventUserType.Guest:
            this.guests = this.guests.filter(e => e.user.id !== user.user.id);
            break;
        }
      }
    })

    this.pipeDestroy(this._portalService.grantedRequestToSpeak$, response => {
      if (response) {
        this.controlsEnabled = true;
      }
    });
  }

  removeUser(user: EventUserDto): void {
    this._portalService.kickUser = user;
  }
}
