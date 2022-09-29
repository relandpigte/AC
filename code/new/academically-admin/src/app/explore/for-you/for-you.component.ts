import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DateGrains, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreForYouComponent extends AppComponentBase implements OnInit {

  top3UpcomingEvent: EventDto[] = Array(3).fill([]).map(() => this.generateRandomEvent()) as EventDto[];

  isLoading = true;

  constructor(
    injector: Injector,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadDataEvents();

    //this.loadDataCoaching();
  }

  private loadDataEvents(): void {
    this.isLoading = true;
    this._eventsService.getByDates(DateGrains.Monthly, 6)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(events => {
        if (events) {
          this.top3UpcomingEvent = [];
          Object.keys(events).forEach(range => {
          const [startDate] = range.split(' - ');
          if (!(moment().diff(moment(startDate), 'months')))
            this.top3UpcomingEvent = _.concat(this.top3UpcomingEvent, events[range]);          
          
          });
        }        
    });
  }

  // private generateData(count?: number, type?: number): any[] {
  //   let data = Array(count).fill([]).map(() => {
  //     const dataType = this.randomNonZero(6);
  //     switch(type ?? dataType) {
  //       case 1: return this.generateRandomEvent();
  //       case 2: return this.generateRandomArticle();
  //       case 3: return this.generateRandomCoaching();
  //       case 4: return this.generateRandomCourse();
  //       case 5: return this.generateRandomWorkshop();
  //     }
  //   });
  //   return data;
  // }
}
