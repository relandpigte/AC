import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

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
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.isLoading = false, this.randomNonZero(5000, 500));
  }

  private loadData(): void {
    this.featured = this.generateData(2);
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
