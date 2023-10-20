import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { PortalPollService } from './_services/portal-poll.service';
import { EventPollDto } from '@shared/service-proxies/service-proxies';

export enum SignalAction {
  PollStarted = 100,
  VoteSubmitted,
  PollStopped,
  SharePoll,
  PollClosed,
}

export enum PollTab {
  Queue, Open, Closed
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

  PollTab = PollTab;
  selectedTab: PollTab = PollTab.Queue;

  selectedPoll: EventPollDto;

  isHost = false;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);

    this.pipeDestroy(this._portalPollService.pollTab$, tab => this.selectedTab = tab);
    this.pipeDestroy(this._portalPollService.pollSelected$, poll => this.selectedPoll = poll);
    this.pipeDestroy(this._portalService.event$, (response) => {
      if (response) {
        this.isHost = response.creatorUserId === this.appSession.userId;
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

  get isQueueTabSelected(): boolean { return this.selectedTab === PollTab.Queue; }
  get isOpenTabSelected(): boolean { return this.selectedTab === PollTab.Open; }
  get isClosedTabSelected(): boolean { return this.selectedTab === PollTab.Closed; }

  handleTabClick(tab: PollTab): void {
    this._portalPollService.pollSelected = null;
    this._portalPollService.pollTabSelected = tab;
  }
}
