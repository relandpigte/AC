import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less']
})
export class QuestionsComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  isHost = false;

  constructor(
    injector: Injector,
    private _portalService: PortalService
  ) {
    super(injector);
  }

  get userId(): number { return this.appSession.userId; }

  ngOnInit(): void {
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(event => {
        this.referenceId = event.id;
        this.isHost = event.creatorUserId === this.userId;
      });
  }
}
