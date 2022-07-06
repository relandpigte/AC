import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPollsServiceProxy, EventPollDto, EventDto } from '@shared/service-proxies/service-proxies';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { PortalPollService } from '@app/events/student-portal/portal/_components/polls/_services/portal-poll.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEditPollComponent } from '@app/events/single-event/resources/_components/create-edit-poll/create-edit-poll.component';

@Component({
  selector: 'app-polls-queue',
  templateUrl: './polls-queue.component.html',
  styleUrls: ['./polls-queue.component.less']
})
export class PollsQueueComponent extends AppComponentBase implements OnInit {
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
    this.pipeDestroy(this._eventPollsService.getAllUnpaged(this.event.id),
      (responses) => {
        this.polls = responses;
      });
  }
}
