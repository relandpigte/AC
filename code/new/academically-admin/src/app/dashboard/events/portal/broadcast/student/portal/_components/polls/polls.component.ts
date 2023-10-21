import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { PortalPollService } from './_services/portal-poll.service';
import { EventPollDto, EventPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PollComponent } from './_components/poll/poll.component';
import { EventPollsStateService, pollsType } from '@shared/services/event-polls-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { HubService } from '@app/_shared/services/hub.service';
import { takeUntil } from 'rxjs/operators';

export enum PollSignalAction {
  PollStarted = 100,
  VoteSubmitted,
  PollStopped,
  SharePoll,
  PollClosed,
}

export enum PollTab {
  Queue, Open, Closed
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends AppComponentBase implements OnInit {
  eventPollsStateService: EventPollsStateService;
  @Input() referenceId: string;
  @ViewChild('queueNav') queueNav: ElementRef;
  @ViewChild('openNav') openNav: ElementRef;
  @ViewChild('closedNav') closedNav: ElementRef;

  PollTab = PollTab;
  selectedTab: PollTab = PollTab.Queue;

  selectedPoll: EventPollDto;
  isSelectedMaximized: boolean;
  pollWindowRef: any;

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
    this.pipeDestroy(this._portalPollService.pollSelectedMaximized$, isMaximized => this.handleSelectedPollMaximized(isMaximized));
    this.pipeDestroy(this._portalService.event$, (response) => {
      if (response) {
        this.isHost = response.creatorUserId === this.appSession.userId;
      }
    });
  }

  async ngOnInit() {
    await this.initPollsAppStates();
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
      if (this.selectedPoll.id === event?.data?.id) {
        this._portalPollService.pollSelected = event.data;
      }
    });
  }

  handleTabClick(tab: PollTab): void {
    this._portalPollService.pollSelected = null;
    this._portalPollService.pollTabSelected = tab;
  }

  handleSelectedPollMaximized(isMaximized: boolean): void {
    this.isSelectedMaximized = isMaximized;
    if (this.selectedPoll) {
      if (isMaximized) {
        const modalSettings = this.defaultModalSettings as ModalOptions<PollComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered w-580-px h-908-px';
        modalSettings.initialState = {
          poll: EventPollDto.fromJS({ ...this.selectedPoll}),
          showBackButton: false,
          isModal: true
        };
        this.pollWindowRef = this._modalService.show(PollComponent, modalSettings);
      } else {
        this.pollWindowRef?.hide();
      }
    }
  }
}
