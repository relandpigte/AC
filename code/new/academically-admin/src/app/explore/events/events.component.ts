import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DateGrains, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreEventsComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: EventDto[]  } = { 'Topic': Array(3).fill([]).map(() => this.generateRandomEvent()) as EventDto[] };

  featured: EventDto[] = Array(5).fill([]).map(() => this.generateRandomEvent()) as EventDto[];
  latest: EventDto[] = Array(3).fill([]).map(() => this.generateRandomEvent()) as EventDto[];
  lastMonth: EventDto[] = Array(3).fill([]).map(() => this.generateRandomEvent()) as EventDto[];

  isLoading = true;

  selectedTopics: string[] = [];

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : []; }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _eventsService: EventsServiceProxy
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
    this._eventsService.getByTopic()
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(events => {
      this.topicGroups = events;
    });
  }

  private loadGroupedByDates(): void {
    this._eventsService.getByDates(DateGrains.Monthly, 6)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(events => {
        this.latest = [];
        this.lastMonth = [];
        Object.keys(events).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months'))
            this.lastMonth = _.concat(this.lastMonth, events[range]);
          else
            this.latest = _.concat(this.latest, events[range]);
        });
      });
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }
}
