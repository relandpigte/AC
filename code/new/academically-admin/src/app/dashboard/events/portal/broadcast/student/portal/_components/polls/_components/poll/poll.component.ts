import { Component, OnInit, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventPollDto, EventPollQuestionDto, EventPollQuestionOptionDto, EventPollQuestionAnswerDto, EventPollStatus, UserDto, EventPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { PortalPollService } from '../../_services/portal-poll.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEditPollComponent } from '@app/dashboard/events/details/broadcast/single/resources/_components/create-edit-poll/create-edit-poll.component';
import { SignalAction, SignalData } from '../../polls.component';
import { HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.less']
})
export class PollComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() poll: EventPollDto;
  @Input() showVoterPercentage = false;
  @Input() showBackButton = true;

  EventPollStatus = EventPollStatus;
  hub: HubConnection;

  answers: EventPollQuestionAnswerDto[] = [];
  voterUserIds: number[] = [];
  chartSettings: any = {};
  totalVoterPercentage = 0;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _eventPollsService: EventPollsServiceProxy,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);

    this.pipeDestroy(this._portalService.attendees$, attendees => {
      if (attendees) this.voterUserIds = attendees.map(e => e.user.id);
    });

    this.pipeDestroy(this._portalService.hub$, hub => {
      if (hub) {
        this.hub = hub;
        this.handleHubEvent();
      }
    });
  }

  ngOnInit(): void {
  }

  get numberOfExpectedVoters(): number { return this.voterUserIds.length; }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.poll) {
      const votedUserIds: number[] = _.flatMap(this.poll.eventPollQuestions, q => q.eventPollAnswers).filter(x => x).map(a => a.creatorUser.id);
      const totalVoterPercentage = this.numberOfExpectedVoters > 0 ? Math.round((votedUserIds.length / this.numberOfExpectedVoters) * 100) : 0;
      if (this.totalVoterPercentage === 0 || this.totalVoterPercentage !== totalVoterPercentage) {
        this.totalVoterPercentage = totalVoterPercentage;
        this.setChartSettings();
      }
    }
  }

  getOptionPercentage(question: EventPollQuestionDto, option: EventPollQuestionOptionDto): string {
    const totalVotes = this.getQuestionTotalVotes(question);
    if (totalVotes > 0) {
      const totalOptionVotes = question.eventPollAnswers.filter(e => e.eventPollQuestionOptionIds.includes(option.id)).length;
      const optionVotePercentage = Math.round((totalOptionVotes / totalVotes) * 100);
      return `${optionVotePercentage}%`;
    }
    return '0%';
  }

  getTotalVoterPercentage(): number {
    const votedUserIds: number[] = _.flatMap(this.poll.eventPollQuestions, q => q.eventPollAnswers).filter(x => x).map(a => a.creatorUser.id);
    return this.numberOfExpectedVoters > 0 ? Math.round((votedUserIds.length / this.numberOfExpectedVoters) * 100) : 0;
  }

  getQuestionTotalVotes(question: EventPollQuestionDto): number {
    return _.sumBy(question.eventPollAnswers, a => a.eventPollQuestionOptionIds.length);
  }

  getVoterUsers(question: EventPollQuestionDto): UserDto[] {
    return _.uniq(question.eventPollAnswers.filter(x => x).map(a => a.creatorUser));
  }

  private setChartSettings(): void {
    this.chartSettings = {
      type: 'doughnut',
      options: {
        cutoutPercentage: 80,
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: function () {
                return '%';
              }
            }
          }
        }
      },
      data: {
        labels: ['Voted', 'NotVoted'],
        datasets: [{
          data: [this.totalVoterPercentage, 100 - this.totalVoterPercentage],
          backgroundColor: ['#2C7BE5', '#D2DCEA']
        }],
      }
    };
  }

  onBackClick(): void {
    this._portalPollService.pollSelected = undefined;
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
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.PollStarted, this.poll));
  }

  onStopClick(): void {
    // this.pollStatus = PollStatus.Stopped;
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.PollStopped, this.poll));
  }

  onShareClick(): void {
    // this.isResultsShared = true;
    this.sendSignal(this.voterUserIds, new SignalData(SignalAction.SharePoll, this.poll));
  }

  onCloseClick(): void {
    // this.pollStatus = PollStatus.Closed;
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
