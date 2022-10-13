import { Component, OnInit, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventPollDto, EventPollQuestionDto, EventPollQuestionOptionDto, EventPollQuestionAnswerDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.less']
})
export class PollComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() poll: EventPollDto;
  @Input() showVoterPercentage = true;
  answers: EventPollQuestionAnswerDto[] = [];
  voterUserIds: number[] = [];
  chartSettings: any = {};
  totalVoterPercentage = 0;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
  ) {
    super(injector);
    this.pipeDestroy(this._portalService.attendees$, (responses) => {
      if (responses) {
        this.voterUserIds = responses.map(e => e.user.id);
        console.log(this.voterUserIds);
      }
    });
    console.log(this.poll);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.poll) {
      console.log('change detected');
      const votedUserIds: number[] = [];
      _.forEach(this.poll.eventPollQuestions, question => {
        _.forEach(question.eventPollAnswers, answer => {
          const index = votedUserIds.findIndex(e => e === answer.creatorUser.id);
          if (index < 0) {
            votedUserIds.push(answer.creatorUser.id);
          }
        });
      });
      const totalVoterPercentage = Math.round((votedUserIds.length / this.voterUserIds.length) * 100);
      if (this.totalVoterPercentage === 0 || this.totalVoterPercentage !== totalVoterPercentage) {
        console.log(totalVoterPercentage);
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
    const votedUserIds: number[] = [];
    _.forEach(this.poll.eventPollQuestions, question => {
      _.forEach(question.eventPollAnswers, answer => {
        const index = votedUserIds.findIndex(e => e === answer.creatorUser.id);
        if (index < 0) {
          votedUserIds.push(answer.creatorUser.id);
        }
      });
    });
    return Math.round((votedUserIds.length / this.voterUserIds.length) * 100);
  }

  getQuestionTotalVotes(question: EventPollQuestionDto): number {
    let totalVotes = 0;
    _.forEach(question.eventPollAnswers, answer => {
      totalVotes += answer.eventPollQuestionOptionIds.length;
    });
    return totalVotes;
  }

  getVoterUsers(question: EventPollQuestionDto): UserDto[] {
    const users: UserDto[] = [];
    _.forEach(question.eventPollAnswers, answer => {
      if (!users.includes(answer.creatorUser)) {
        users.push(answer.creatorUser);
      }
    });
    return users;
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
}
