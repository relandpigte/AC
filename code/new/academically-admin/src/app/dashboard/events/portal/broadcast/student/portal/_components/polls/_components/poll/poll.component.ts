import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreateEditPollComponent } from '@app/dashboard/events/details/broadcast/single/resources/_components/create-edit-poll/create-edit-poll.component';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { AppComponentBase, SignalData } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { EventPollAnswerDto, EventPollDto, EventPollQuestionDto, EventPollQuestionOptionDto, EventPollQuestionType, EventPollStatus, EventPollsServiceProxy, UpsertEventPollAnswerDto, UserDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PollTab, PortalPollService } from '../../_services/portal-poll.service';
import { PollSignalAction } from '../../polls.component';

export interface PollViewModel {
  answersMap?: Map<number, EventPollAnswerDto[]>;
  chartSettings?: any;
  voterUserIds?: number[];
  numberOfExpectedVoters?: number;
  isHost?: boolean;
  isResultsView?: boolean;
  isResultsShared?: boolean;
  isShowVoterPercentage?: boolean;
  isShowVotedUsersAvatar?: boolean;
  hasFinishedVoting?: boolean;
  hasMissedVoting?: boolean;
  pollQuestions?: EventPollQuestionDto[];
  pollAnswers?: EventPollAnswerDto[];
  pollSubmittedAnswers?: EventPollAnswerDto[];
}

export interface PollInitOptions {
  chartOptions?: PollChartOptions
}

export interface PollChartOptions {
  disableAnimation?: boolean;
}

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
  EventPollQuestionType = EventPollQuestionType;

  model: PollViewModel = {};

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _eventPollsService: EventPollsServiceProxy,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);

    this.pipeDestroy(this._portalService.attendees$, attendees => {
      if (attendees) this.model.voterUserIds = attendees.map(e => e.user.id);
    });

    this.pipeDestroy(this._portalService.hub$, hub => {
      if (hub) {
        this.hub = hub;
        this.handleHubEvent();
      }
    });

    this.pipeDestroy(this._portalPollService.pollSelected$, poll => {
      this.poll = poll;
      if (poll) this.init({ chartOptions: { disableAnimation: true }});
    });
    this.pipeDestroy(this._portalPollService.pollSelectedMaximized$, maximized => this.isMaximized = maximized);
  }

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

  private init(options?: PollInitOptions): void {
    this.model.answersMap = this.getAnswersMap();
    this.model.chartSettings = this.getChartSettings(options?.chartOptions);
    this.model.numberOfExpectedVoters = this.model?.voterUserIds?.length ?? 0;
    this.model.isHost = this.poll?.creatorUserId === this.appSession.userId ?? false;
    this.model.isResultsShared = !!this.poll?.sharedTime;
    this.model.isShowVoterPercentage = this.poll?.status !== EventPollStatus.Queue ?? false;
    this.model.isShowVotedUsersAvatar = ((!this.model?.isHost && this.poll.status === EventPollStatus.Open) || (this.model?.isHost && this.poll.status !== EventPollStatus.Queue)) ?? false;
    this.model.pollQuestions = this.poll?.eventPollQuestions ?? [];
    this.model.pollAnswers = this.model?.answersMap?.get(this.appSession.userId) ?? [];
    this.model.pollSubmittedAnswers = this.model?.pollAnswers?.filter(x => !!x.submittedTime) ?? [];
    this.model.hasFinishedVoting = (this.model?.isHost === false && this.model?.pollQuestions?.every(q => q.hasBeenAnswered)) ?? false;
    this.model.isResultsView = (!this.model?.isHost && (this.poll?.status === EventPollStatus.Closed || this.model?.hasFinishedVoting)) ?? false;
    this.model.hasMissedVoting = this.model?.pollSubmittedAnswers?.length === 0 ?? false;
  }

  private getAnswersMap(): Map<number, EventPollAnswerDto[]> {
    return _.flatMap(this.poll.eventPollQuestions, q => q.eventPollAnswers).filter(x => x).reduce(
      (map, curr) => map.set(curr.creatorUserId, [ ...(map.get(curr.creatorUserId) ?? []), curr ]),
      new Map<number, EventPollAnswerDto[]>()
    );
  }

  private getChartSettings(options?: PollChartOptions) {
    let chartSettings: any = {
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
          data: [this.getTotalVoterPercentage(), 100 - this.getTotalVoterPercentage()],
          backgroundColor: ['#2C7BE5', '#D2DCEA']
        }],
      }
    };

    if (options?.disableAnimation) {
      chartSettings.options = { ...chartSettings.options, animation: { duration: 0 }};
    }

    return chartSettings;
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
      const totalOptionVotes = question.eventPollAnswers.filter(a => a.eventPollQuestionOptionId === option.id && !!a.submittedTime).length;
      const optionVotePercentage = Math.round((totalOptionVotes / totalVotes) * 100);
      return `${optionVotePercentage}%`;
    }
    return '0%';
  }

  getTotalVoterPercentage(): number {
    const votedUserIds: number[] = _.uniq(_.flatMap(this.poll.eventPollQuestions, q => q.eventPollAnswers).filter(x => x && !!x.submittedTime).map(a => a.creatorUserId));
    return this.model.numberOfExpectedVoters > 0 ? Math.round((votedUserIds.length / this.model.numberOfExpectedVoters) * 100) : 0;
  }

  getQuestionTotalVotes(question: EventPollQuestionDto): number {
    return question?.eventPollAnswers?.filter(x => x && !!x.submittedTime)?.length ?? 0;
  }

  getVoterUsers(question: EventPollQuestionDto): UserDto[] {
    return _.uniq(question.eventPollAnswers?.filter(x => x && !!x.submittedTime).map(a => a.creatorUser) ?? []);
  }



  onVoteSubmittedEvent(data: any): void {
    const answer = new EventPollAnswerDto();
    answer.init(data as EventPollAnswerDto);
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
    this.pipeDestroy(this._eventPollsService.launchPoll(this.poll.id), _ => {});
  }

  onDoneClick(): void {
    this._portalPollService.pollSelectedMaximized = false;
    setTimeout(() => this._portalPollService.pollSelected = undefined, 500);
  }

  onShareClick(): void {
    this.pipeDestroy(this._eventPollsService.sharePoll(this.poll.id), _ => {});
  }

  onCloseClick(): void {
    this.pipeDestroy(this._eventPollsService.closePoll(this.poll.id), _ => {});
  }

  onSubmitClick(): void {
    this.pipeDestroy(this._eventPollsService.submitPollAnswers(this.poll.eventId, this.poll.id), _ => {});
  }

  onToggleViewClick(): void {
    this.isMaximized = !this.isMaximized;
    this._portalPollService.pollTabSelected = this.poll.status === EventPollStatus.Queue ?
      PollTab.Queue : this.poll.status === EventPollStatus.Open ?
      PollTab.Open : PollTab.Closed;
    this._portalPollService.pollSelectedMaximized = this.isMaximized;
  }

  checkVotedOption(option: EventPollQuestionOptionDto): boolean {
    const answers = this.model.answersMap.get(this.appSession.userId);
    return !!answers?.find(a => a.eventPollQuestionOptionId === option.id);
  }

  onOptionClick(question: EventPollQuestionDto, option: EventPollQuestionOptionDto): void {
    this.pipeDestroy(this._eventPollsService.upsertPollAnswer(UpsertEventPollAnswerDto.fromJS({
      referenceId: this.poll.eventId,
      eventPollId: this.poll.id,
      eventPollQuestionId: question.id,
      eventPollQuestionOptionId: option.id,
      creatorUserId: this.appSession.userId
    })), _ => {});
  }
}
