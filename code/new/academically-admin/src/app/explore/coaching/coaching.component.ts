import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, CoachingsServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-coachings',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreCoachingComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: CoachingDto[]  } = { 'Topic': Array(3).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[] };

  featured: CoachingDto[] = Array(5).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];
  latest: CoachingDto[] = Array(3).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];
  lastMonth: CoachingDto[] = Array(3).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];

  isLoading = true;

  selectedTopics: string[] = [];

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : null; }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _coachingsService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    if (this.isGroupByTopics) this.loadGroupedByTopics();
    else this.loadGroupedByDates();
  }

  private loadGroupedByTopics(): void {
    this._coachingsService.getByTopic()
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(coachings => {
      this.topicGroups = coachings;
    });
  }

  private loadGroupedByDates(): void {
    this.isLoading = true;
    this._coachingsService.getByDates(DateGrains.Monthly, 6)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(coachings => {
        this.latest = [];
        this.lastMonth = [];
        Object.keys(coachings).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months'))
            this.lastMonth = _.concat(this.lastMonth, coachings[range]);
          else
            this.latest = _.concat(this.latest, coachings[range]);
        });
      });
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }
}
