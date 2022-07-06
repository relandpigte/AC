import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { PortalPollService } from './_services/portal-poll.service';

export enum SignalAction {
  PollStarted = 100,
  VoteSubmitted,
  PollStopped,
  SharePoll,
  PollClosed,
}

export class SignalData<TObject> {
  action: SignalAction;
  data: string;

  constructor(action?: SignalAction, data?: TObject) {
    this.action = action;
    if (data !== undefined) {
      this.data = JSON.stringify(data);
    } else {
      this.data = '';
    }
  }

  public getDataObject(): TObject {
    return JSON.parse(this.data) as TObject;
  }
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends AppComponentBase implements OnInit {
  @ViewChild('queueNav') queueNav: ElementRef;
  @ViewChild('openNav') openNav: ElementRef;
  @ViewChild('closedNav') closedNav: ElementRef;

  isHost = false;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);
    this.pipeDestroy(this._portalService.event$, (response) => {
      if (response) {
        this.isHost = response.creatorUserId === this.appSession.userId;
      }
    });
    this.pipeDestroy(this._portalPollService.pollSelected$, (response) => {
      if (response != null && this.openNav) {
        (this.openNav.nativeElement as HTMLDivElement).click();
      }
    });
    this.pipeDestroy(this._portalPollService.pollCancelled$, (response) => {
      if (response) {
        (this.queueNav.nativeElement as HTMLDivElement).click();
        setTimeout(() => {
          this._portalPollService.pollSelected = undefined;
        }, 500);
      }
    });
  }

  ngOnInit(): void {
  }

}
