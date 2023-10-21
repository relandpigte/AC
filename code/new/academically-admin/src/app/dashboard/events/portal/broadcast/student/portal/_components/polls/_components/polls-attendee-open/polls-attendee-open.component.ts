import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase, SignalData } from '@shared/app-component-base';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { HubConnection } from '@aspnet/signalr';
import {
  EventPollDto,
  EventPollQuestionDto,
  EventPollQuestionOptionDto,
  EventDto,
  EventPollQuestionAnswerDto,
  EventUserDto,
  EventPollQuestionType,
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { PortalPollService } from '../../_services/portal-poll.service';
import { PollSignalAction } from '../../polls.component';

@Component({
  selector: 'app-polls-attendee-open',
  templateUrl: './polls-attendee-open.component.html',
  styleUrls: ['./polls-attendee-open.component.less']
})
export class PollsAttendeeOpenComponent extends AppComponentBase implements OnInit {
  event = new EventDto();
  eventUser = new EventUserDto();
  poll: EventPollDto;
  hub: HubConnection;
  answers: EventPollQuestionAnswerDto[] = [];
  sharedPoll: EventPollDto;
  votingFinished = false;

  EventPollQuestionType = EventPollQuestionType;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);
    this.pipeDestroy(this._portalService.event$, (response) => {
      if (response) {
        this.event = response;
      }
    });
    this.pipeDestroy(this._portalService.hub$, (response) => {
      if (response) {
        this.hub = response;
        this.handleHubEvent();
      }
    });
    this.pipeDestroy(this._portalService.attendees$, (responses) => {
      if (responses) {
        this.eventUser = responses.find(e => e.user.id === this.appSession.userId);
      }
    });
    this.pipeDestroy(this._portalPollService.pollSelected$, (response) => {
      this.answers = [];
      this.sharedPoll = undefined;
      this.votingFinished = false;
      this.poll = response;
      if (this.poll) {
        _.forEach(this.poll.eventPollQuestions, question => {
          const answer = new EventPollQuestionAnswerDto();
          answer.creatorUser = this.eventUser.user;
          answer.eventPollQuestionId = question.id;
          answer.eventPollQuestionOptionIds = [];
          this.answers.push(answer);
        });
      }
    });
  }

  ngOnInit(): void {
  }

  checkVotedOption(option: EventPollQuestionOptionDto): boolean {
    const pollVote = this.answers.find(e => e.eventPollQuestionId === option.eventPollQuestionId);
    return pollVote.eventPollQuestionOptionIds.findIndex(e => e === option.id) >= 0;
  }

  checkQuestionHasVote(question: EventPollQuestionDto): boolean {
    return this.answers.find(e => e.eventPollQuestionId === question.id).eventPollQuestionOptionIds.length > 0;
  }

  onOptionClick(question: EventPollQuestionDto, option: EventPollQuestionOptionDto): void {
    const answer = this.answers.find(e => e.eventPollQuestionId === option.eventPollQuestionId);
    if (question.type === EventPollQuestionType.MultipleResponse) {
      const index = answer.eventPollQuestionOptionIds.findIndex(e => e === option.id);
      if (index >= 0) {
        answer.eventPollQuestionOptionIds.splice(index, 1);
      } else {
        answer.eventPollQuestionOptionIds.push(option.id);
      }
    } else {
      answer.eventPollQuestionOptionIds = [option.id];
    }
  }

  onVoteClick(question: EventPollQuestionDto): void {
    const answer = this.answers.find(e => e.eventPollQuestionId === question.id);
    this.sendSignal([this.event.creatorUserId], new SignalData(PollSignalAction.VoteSubmitted, answer));
    const index = this.poll.eventPollQuestions.findIndex(e => e.id === question.id);
    this.poll.eventPollQuestions.splice(index, 1);
    if (this.poll.eventPollQuestions.length === 0) {
      this.votingFinished = true;
    }
  }

  private handleHubEvent(): void {
    this.receiveSignal(async (sSignalData: string) => {
      const signalData = new SignalData();
      Object.assign(signalData, JSON.parse(sSignalData));
      switch (signalData.action) {
        case PollSignalAction.PollStarted:
          this._portalPollService.pollSelected = signalData.getDataObject() as EventPollDto;
          break;

        case PollSignalAction.PollStopped:
          this.votingFinished = true;
          break;

        case PollSignalAction.SharePoll:
          this.sharedPoll = JSON.parse(signalData.data) as EventPollDto;
          break;
      }
    });
  }
}
