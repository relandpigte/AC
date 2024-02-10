import { Component, Injector, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { ActivityType, ServiceActivityDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-service-card-activity',
  templateUrl: './service-card-activity.component.html',
  styleUrls: ['./service-card-activity.component.less']
})
export class ServiceCardActivityComponent extends AppComponentBase implements OnInit {
  @Input() activity: ServiceActivityDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get isPoll(): boolean { return ActivityType.Poll === this.activity?.activityType; }
  get activityType(): string { return ActivityType[this.activity?.activityType]; }
  get activityName(): string { return this.isPoll ? this.activity?.poll?.name : this.activity?.quiz?.name; }
  get activityDuration(): string {
    const seconds = this.isPoll ? this.activity?.poll?.duration : this.activity?.quiz?.duration;
    const duration = moment.duration(seconds, 'seconds');
    return duration.asMinutes().toString() + ' mins';
  }
  get activityQuestions(): string {
    const questions = this.isPoll ? this.activity?.poll?.servicePollQuestions?.length : this.activity?.quiz?.serviceQuizQuestions?.length;
    return `${questions} questions`;
  }

  ngOnInit(): void {
  }
}
