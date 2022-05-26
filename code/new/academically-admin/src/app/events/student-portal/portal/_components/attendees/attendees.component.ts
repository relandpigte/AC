import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.less']
})
export class AttendeesComponent extends AppComponentBase implements OnInit {
  isHost = false;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
  ) {
    super(injector);
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.isHost = response.creatorUserId === this.appSession.userId;
      });
  }

  ngOnInit(): void {
  }

}
