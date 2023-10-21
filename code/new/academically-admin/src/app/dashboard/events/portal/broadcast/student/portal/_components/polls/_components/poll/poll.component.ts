import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreateEditPollComponent } from '@app/dashboard/events/details/broadcast/single/resources/_components/create-edit-poll/create-edit-poll.component';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { AppComponentBase, SignalData } from '@shared/app-component-base';
import { EventPollDto, EventPollQuestionAnswerDto, EventPollQuestionDto, EventPollQuestionOptionDto, EventPollStatus, EventPollsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PortalPollService } from '../../_services/portal-poll.service';
import { PollSignalAction, PollTab } from '../../polls.component';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.less']
})
export class PollComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() poll: EventPollDto;
  @Input() showBackButton = true;
  @Input() showToggleViewButton = true;

  isModal = false;
  isMaximized = false;

  EventPollStatus = EventPollStatus;

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

    this.pipeDestroy(this._portalPollService.pollSelected$, poll => this.poll = poll);
    this.pipeDestroy(this._portalPollService.pollSelectedMaximized$, maximized => this.isMaximized = maximized);
  }

  get numberOfExpectedVoters(): number { return this.voterUserIds.length; }
  get isShowVoterPercentage(): boolean { return this.poll.status !== EventPollStatus.Queue; }

  ngOnInit(): void {
    if (this.poll) {
      this.init();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.poll) {
      this.init();
    }
  }

  private init(): void {
    const votedUserIds: number[] = _.flatMap(this.poll.eventPollQuestions, q => q.eventPollAnswers).filter(x => x).map(a => a.creatorUser.id);
    const totalVoterPercentage = this.numberOfExpectedVoters > 0 ? Math.round((votedUserIds.length / this.numberOfExpectedVoters) * 100) : 0;
    if (this.totalVoterPercentage === 0 || this.totalVoterPercentage !== totalVoterPercentage) {
      this.totalVoterPercentage = totalVoterPercentage;
      setTimeout(() => this.setChartSettings());
    }
  }

  private handleHubEvent(): void {
    this.receiveSignal(async (sSignalData: string) => {
      if (this.poll) {
        const signalData = new SignalData();
        Object.assign(signalData, JSON.parse(sSignalData));

        switch (signalData.action) {
          case PollSignalAction.VoteSubmitted:
            this.onVoteSubmittedEvent(signalData.getDataObject());
            break;
        }
      }
    });
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
    return _.uniq(question.eventPollAnswers?.filter(x => x).map(a => a.creatorUser) ?? []);
  }

  private setChartSettings(): void {
    this.chartSettings = {
      type: 'doughnut',
      options: {
        aspectRatio: 1,
        cutoutPercentage: this.isModal ? 80 : 70,
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: function () {
                return '%';
              },
            },
          },
        },
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

  onVoteSubmittedEvent(data: any): void {
    const answer = new EventPollQuestionAnswerDto();
    answer.init(data as EventPollQuestionAnswerDto);
    const question = this.poll.eventPollQuestions.find(e => e.id === answer.eventPollQuestionId);
    if (!question.eventPollAnswers) {
      question.eventPollAnswers = [];
    }
    question.eventPollAnswers.push(answer);
    this.poll = _.cloneDeep(this.poll);
  }

  onBackClick(): void {
    this._portalPollService.pollSelected = undefined;
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

  onLaunchClick(): void {
    this.pipeDestroy(this._eventPollsService.launchPoll(this.poll.id), _ => {
      setTimeout(() => this._portalPollService.pollSelectedMaximized = true);
    });
  }

  onStopClick(): void {
    // this.pollStatus = PollStatus.Stopped;
    this.sendSignal(this.voterUserIds, new SignalData(PollSignalAction.PollStopped, this.poll));
  }

  onShareClick(): void {
    // this.isResultsShared = true;
    this.sendSignal(this.voterUserIds, new SignalData(PollSignalAction.SharePoll, this.poll));
  }

  onCloseClick(): void {
    // this.pollStatus = PollStatus.Closed;
    const tempPoll = this.poll;
    this._portalPollService.pollSelected = undefined;
    this.sendSignal(this.voterUserIds, new SignalData(PollSignalAction.PollClosed, tempPoll));
  }

  onToggleViewClick(): void {
    this.isMaximized = !this.isMaximized;
    this._portalPollService.pollTabSelected = this.poll.status === EventPollStatus.Queue ?
      PollTab.Queue : this.poll.status === EventPollStatus.Open ?
      PollTab.Open : PollTab.Closed;
    this._portalPollService.pollSelectedMaximized = this.isMaximized;
  }


}
