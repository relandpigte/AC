import { Component, OnInit, Injector } from '@angular/core';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { EventPresenterDto, EventUserDto, EventUserType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.less']
})
export class RegistrantsComponent extends AppComponentBase implements OnInit {
  attendees: EventUserDto[] = [];
  lobbyUsers: EventUserDto[] = [];
  waitingUsers: EventUserDto[] = [];

  EventUserType = EventUserType;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._portalService.attendees$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        console.log('registrants - attendees');
        this.attendees = _.cloneDeep(responses);
      });
    this._portalService.lobbyUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          console.log('registrants - lobbyUser');
          const index = this.attendees.findIndex(e => e.user.id === response.user.id);
          this.attendees.splice(index, 1);
          this.lobbyUsers.push(response);
        }
      });
    this._portalService.guestJoined$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          console.log('registrants - guestJoined');
          const index = this.lobbyUsers.findIndex(e => e.user.id === response.user.id);
          if (index >= 0) {
            this.lobbyUsers.splice(index, 1);
          }
          this.waitingUsers.push(response);
        }
      });
    this._portalService.attendeeJoined$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          console.log('registrants - attendeeJoined');
          const index = this.attendees.findIndex(e => e.user.id === response.user.id);
          if (index >= 0) {
            this.attendees.splice(index, 1);
          }
        }
      });
  }

  onAdmitClick(eventUser: EventUserDto): void {
    this._portalService.admitGuest = eventUser;
    const index = this.waitingUsers.findIndex(e => e.user.id === eventUser.user.id);
    this.waitingUsers.splice(index, 1);
  }
}
