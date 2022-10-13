import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPollDto, EventPollsServiceProxy, EventPollQuestionAnswerDto } from '@shared/service-proxies/service-proxies';
import { PortalPollService } from '../../_services/portal-poll.service';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditPollComponent } from '@app/dashboard/events/details/broadcast/single/resources/_components/create-edit-poll/create-edit-poll.component';
import { HubConnection } from '@aspnet/signalr';
import { SignalData, SignalAction } from '../../polls.component';
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
  poll: EventPollDto;
  hub: HubConnection;
  pollStatus = PollStatus.Preparing;
  isResultsShared = false;
  voterUserIds: number[] = [];

  PollStatus = PollStatus;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
    private _modalService: BsModalService,
    private _eventPollsService: EventPollsServiceProxy,
  ) {
    super(injector);
    this.pipeDestroy(this._portalService.hub$, (response) => {
      if (response) {
        this.hub = response;
        this.handleHubEvent();
      }
    });
    this.pipeDestroy(this._portalService.attendees$, (responses) => {
      if (responses) {
        this.voterUserIds = responses.map(e => e.user.id);
      }
    });
    this.pipeDestroy(this._portalPollService.pollSelected$, (response) => {
      this.poll = response;
      this.isResultsShared = false;
      this.pollStatus = PollStatus.Preparing;
    });
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this._portalPollService.pollCancelled = this.poll;
  }

  onEditClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      model: this.poll,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    this.pipeDestroy(modal.modelSaved, () => {
      this.pipeDestroy(this._eventPollsService.get(this.poll.id), (response) => {
        this._portalPollService.pollSelected = response;
        this._portalPollService.refreshPollQueue = true;
      });
    });
  }

  onStartClick(): void {
    this.pollStatus = PollStatus.Started;
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.PollStarted, this.poll));
  }

  onStopClick(): void {
    this.pollStatus = PollStatus.Stopped;
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.PollStopped, this.poll));
  }

  onShareClick(): void {
    this.isResultsShared = true;
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.SharePoll, this.poll));
  }

  onCloseClick(): void {
    this.pollStatus = PollStatus.Closed;
    const tempPoll = this.poll;
    this._portalPollService.pollClosed = tempPoll;
    this._portalPollService.pollSelected = undefined;
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.PollClosed, tempPoll));
  }

  private async sendSignal<TObject>(userIds: number[], signalData: SignalData<TObject>, callback?: () => void): Promise<void> {
    console.log('invoking sendSignal');
    console.log(userIds);
    console.log(signalData);
    const sSignalData = JSON.stringify(signalData);
    await this.hub.invoke('sendSignal', userIds, sSignalData)
      .then(() => {
        if (callback) {
          callback();
        }
      });
  }

  private handleHubEvent(): void {
    this.hub.on('receiveSignal', async (sSignalData: string) => {
      if (this.poll) {
        const signalData = new SignalData();
        Object.assign(signalData, JSON.parse(sSignalData));
        console.log('handling receiveSignal');

        switch (signalData.action) {
          case SignalAction.VoteSubmitted:
            console.log('receieveSignal - VoteSubmitted');
            const answer = new EventPollQuestionAnswerDto();
            answer.init(signalData.getDataObject() as EventPollQuestionAnswerDto);
            const question = this.poll.eventPollQuestions.find(e => e.id === answer.eventPollQuestionId);
            if (!question.eventPollAnswers) {
              question.eventPollAnswers = [];
            }
            question.eventPollAnswers.push(answer);
            this.poll = _.cloneDeep(this.poll);
            break;
        }
      }
    });
  }
}
