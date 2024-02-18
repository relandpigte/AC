import { Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPollDto, EventPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { EventPollsStateService, pollsType } from '@shared/services/event-polls-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { PortalService } from '../../_services/portal.service';
import { PollTab, PortalPollService } from './_services/portal-poll.service';

export enum PollSignalAction {
  PollStarted = 100,
  VoteSubmitted,
  PollStopped,
  SharePoll,
  PollClosed,
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends AppComponentBase implements OnInit, OnDestroy {
  eventPollsStateService: EventPollsStateService;
  @Input() referenceId: string;
  @ViewChild('queueNav') queueNav: ElementRef;
  @ViewChild('openNav') openNav: ElementRef;
  @ViewChild('closedNav') closedNav: ElementRef;

  PollTab = PollTab;
  selectedTab: PollTab = PollTab.Queue;

  selectedPoll: EventPollDto;
  isSelectedMaximized: boolean;

  isHost = false;

  constructor(
    injector: Injector,
    private _hubService: HubService,
    private _modalService: BsModalService,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
    private _eventPollsService: EventPollsServiceProxy
  ) {
    super(injector);

    this.pipeDestroy(this._portalPollService.pollTab$, tab => this.selectedTab = tab);
    this.pipeDestroy(this._portalPollService.pollSelected$, poll => this.selectedPoll = poll);
    this.pipeDestroy(this._portalService.event$, (response) => {
      if (response) {
        this.isHost = response.creatorUserId === this.appSession.userId;
        this.selectedTab = this.isHost ? PollTab.Queue : PollTab.Open;
      }
    });
    this.pipeDestroy(this._portalPollService.pollSelectedMaximized$, isMaximized => this.isSelectedMaximized = isMaximized);
  }

  async ngOnInit() {
    await this.initPollsAppStates();
  }

  async ngOnDestroy() {
    await this.eventPollsStateService?.stop();
  }

  get pollsStateId(): string { return 'polls-event'; }
  get isQueueTabSelected(): boolean { return this.selectedTab === PollTab.Queue; }
  get isOpenTabSelected(): boolean { return this.selectedTab === PollTab.Open; }
  get isClosedTabSelected(): boolean { return this.selectedTab === PollTab.Closed; }

  private async initPollsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.pollsStateId]: {
        update: { referenceId: this.referenceId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.pollsStateId]: {
        type: EventPollsStateService,
        args: [pollsType.all, this.appSession, this._hubService, this._eventPollsService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.eventPollsStateService = this.pubSubService.getStateService<EventPollsStateService>(this.pollsStateId);
    this.eventPollsStateService.polls$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.selectedPoll?.id === event?.data?.id) {
        this._portalPollService.pollSelected = event.data;
      }
    });
  }

  handleTabClick(tab: PollTab): void {
    this._portalPollService.pollSelected = null;
    this._portalPollService.pollTabSelected = tab;
  }


}
