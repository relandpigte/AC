import { Component, OnInit, Injector, Input, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPollsServiceProxy, EventPollDto, EventDto, EventPollStatus } from '@shared/service-proxies/service-proxies';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { PortalPollService } from '@app/dashboard/events/portal/broadcast/student/portal/_components/polls/_services/portal-poll.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEditPollComponent } from '@app/dashboard/events/details/broadcast/single/resources/_components/create-edit-poll/create-edit-poll.component';
import { EventPollsStateService, pollsType } from '@shared/services/event-polls-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { BehaviorSubject } from 'rxjs';
import { HubService } from '@app/_shared/services/hub.service';
import { takeUntil } from 'rxjs/operators';
import { StateUpdateType } from '@shared/services/state-base.service';

@Component({
  selector: 'app-polls-queue',
  templateUrl: './polls-queue.component.html',
  styleUrls: ['./polls-queue.component.less']
})
export class PollsQueueComponent extends AppComponentBase implements OnInit {
  pollsStateService: EventPollsStateService;
  @Input() referenceId: string;
  @Input() isHost = false;

  polls: EventPollDto[] = [];
  totalPollsCount = 0;
  isLoadingList$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
    private _eventPollsService: EventPollsServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
    this.pipeDestroy(this._portalPollService.refreshPollQueue$, (response) => {
      if (response) {
        this.getAllPolls();
      }
    });
  }

  get pollsStateId(): string { return 'polls-queued'; }
  get loadingSources$() { return [ this.isLoadingList$ ]; }

  async ngOnInit() {
    await this.initPollsAppStates();
  }

  private async initPollsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.pollsStateId]: {
        load: [this.referenceId, EventPollStatus.Queue],
        update: { referenceId: this.referenceId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.pollsStateId]: {
        type: EventPollsStateService,
        args: [pollsType.queued, this.appSession, this._hubService, this._eventPollsService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.pollsStateService = this.pubSubService.getStateService<EventPollsStateService>(this.pollsStateId);
    this.pollsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingList$.next(loading));
    this.pollsStateService.polls$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          this.polls = [event.data].concat(this.polls);
          this.totalPollsCount++;
          break;
        case StateUpdateType.Update:
          if (event.silent) {
            this.polls = this.polls.map(c => c.id === event.data.id ? event.data : c);
          } else {
            const idx = this.polls.findIndex(c => c.id === event.data.id);
            this.polls.splice(idx, 1);
            this.polls = [event.data].concat(this.polls);
          }
          break;
        case StateUpdateType.Delete:
          this.polls = this.polls.filter(c => c.id != event.data.id);
          this.totalPollsCount--;
          break;
      }
      this._cdr.detectChanges();
    });
    this.polls = this.pollsStateService.getAllPolls();
    this.totalPollsCount = this.pollsStateService.totalPollsCount;
  }

  onSelectClick(poll: EventPollDto): void {
    this._portalPollService.pollSelected = _.cloneDeep(poll);
  }

  onCreatePollClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      eventId: this.referenceId,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    this.pipeDestroy(modal.modelSaved, () => {
      this._portalPollService.refreshPollQueue = true;
    });
  }

  private getAllPolls(): void {
    this.pipeDestroy(this._eventPollsService.getAllUnpaged(this.referenceId, EventPollStatus.Queue), polls => this.polls = polls);
  }
}
