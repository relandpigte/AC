import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { HubConnection } from '@aspnet/signalr';
import { SignalData, SignalAction } from '../../polls.component';
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
    console.log(answer);
    this.sendSignal([this.event.creatorUserId], new SignalData(SignalAction.VoteSubmitted, answer));
    const index = this.poll.eventPollQuestions.findIndex(e => e.id === question.id);
    this.poll.eventPollQuestions.splice(index, 1);
    if (this.poll.eventPollQuestions.length === 0) {
      this.votingFinished = true;
    }
  }

  private handleHubEvent(): void {
    this.hub.on('receiveSignal', async (sSignalData: string) => {
      const signalData = new SignalData();
      Object.assign(signalData, JSON.parse(sSignalData));
      console.log('handling receiveSignal');
      console.log(sSignalData);
      console.log(signalData);

      switch (signalData.action) {
        case SignalAction.PollStarted:
          console.log('receieveSignal - PollStarted');
          this._portalPollService.pollSelected = signalData.getDataObject() as EventPollDto;
          break;

        case SignalAction.PollStopped:
          console.log('receieveSignal - PollStopped');
          this.votingFinished = true;
          break;

        case SignalAction.SharePoll:
          console.log('receieveSignal - SharePoll');
          this.sharedPoll = JSON.parse(signalData.data) as EventPollDto;
          break;

        case SignalAction.PollClosed:
          console.log('receieveSignal - PollClosed');
          this._portalPollService.pollSelected = undefined;
          this._portalPollService.pollClosed = JSON.parse(signalData.data) as EventPollDto;
          break;
      }
    });
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
}
