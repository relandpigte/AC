import { Component, OnInit, Injector } from '@angular/core';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { StudentEventDto, EventDto, EventsServiceProxy, EventPresenterDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.less']
})
export class RegistrantsComponent extends AppComponentBase implements OnInit {
  audiences: StudentEventDto[] = [];
  presenters: EventPresenterDto[] = [];
  waitingPresenters: EventPresenterDto[] = [];

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
    this._portalService.presenters$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.presenters = responses;
      });
    this._portalService.guestJoined$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          const index = this.presenters.findIndex(e => e.id === response.id);
          this.presenters.splice(index, 1);
          this.waitingPresenters.push(response);
        }
      });
    this._portalService.audienceJoined$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          const index = this.audiences.findIndex(e => e.id === response.id);
          this.audiences.splice(index, 1);
        }
      });
  }

  onAdmitClick(presenter: EventPresenterDto): void {
    this._portalService.admitGuest = presenter;
    const index = this.waitingPresenters.findIndex(e => e.id === presenter.id);
    this.waitingPresenters.splice(index, 1);
  }
}
