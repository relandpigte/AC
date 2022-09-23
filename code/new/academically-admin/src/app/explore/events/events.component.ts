import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DateGrains, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-explore-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreEventsComponent extends AppComponentBase implements OnInit {

  featured: any[];
  latest: any[];
  lastMonth: any[];

  isLoading = true;

  constructor(
    injector: Injector,
    private _eventsService: EventsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.isLoading = false, this.randomNonZero(5000, 500));
  }

  private loadData(): void {
    this._eventsService.getByDates(DateGrains.Monthly, 6)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(events => {
        console.error('@@@ events: ', events);
      });

    this.featured = this.generateData(5, 1);
    this.latest = this.generateData(6, 1);
    this.lastMonth = this.generateData(6, 1);
  }

  private generateData(count?: number, type?: number): any[] {
    let data = Array(count).fill([]).map(() => {
      const dataType = this.randomNonZero(6);
      switch(type ?? dataType) {
        case 1: return this.generateRandomEvent();
        case 2: return this.generateRandomArticle();
        case 3: return this.generateRandomCoaching();
        case 4: return this.generateRandomCourse();
        case 5: return this.generateRandomWorkshop();
      }
    });
    return data;
  }
}
