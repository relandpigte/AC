import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPollDto, EventPollsServiceProxy, EventPollQuestionAnswerDto, EventPollStatus, EventDto } from '@shared/service-proxies/service-proxies';
import { PortalPollService } from '../../_services/portal-poll.service';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditPollComponent } from '@app/dashboard/events/details/broadcast/single/resources/_components/create-edit-poll/create-edit-poll.component';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import * as _ from 'lodash';

enum PollStatus {
  Preparing,
  Started,
  Stopped,
  Closed,
}

@Component({
  selector: 'app-polls-open',
  templateUrl: './polls-open.component.html',
  styleUrls: ['./polls-open.component.less']
})
export class PollsOpenComponent extends AppComponentBase implements OnInit {
  event = new EventDto();
  polls: EventPollDto[] = [];

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
    private _eventPollsService: EventPollsServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
    this.pipeDestroy(this._portalService.event$, (response) => {
      if (response) {
        this.event = response;
        this.getAllPolls();
      }
    });
    this.pipeDestroy(this._portalPollService.refreshPollQueue$, (response) => {
      if (response) {
        this.getAllPolls();
      }
    });
  }

  ngOnInit(): void {
  }

  onSelectClick(poll: EventPollDto): void {
    this._portalPollService.pollSelected = _.cloneDeep(poll);
  }

  onCreatePollClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      eventId: this.event.id,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    this.pipeDestroy(modal.modelSaved, () => {
      this._portalPollService.refreshPollQueue = true;
    });
  }

  private getAllPolls(): void {
    this.pipeDestroy(this._eventPollsService.getAllUnpaged(this.event.id, EventPollStatus.Open), polls => this.polls = polls);
  }
}
