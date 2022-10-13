import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.less']
})
export class OffersComponent extends AppComponentBase implements OnInit {
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
