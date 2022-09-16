import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-explore-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreArticlesComponent extends AppComponentBase implements OnInit {

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
    setTimeout(() => this.isLoading = false, 5000);
  }

  private loadData(): void {
    this.latest = this.generateData(6, 2);
    this.lastMonth = this.generateData(6, 2);
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
        case 6: return this.generateRandomTutorial();
      }
    });
    return data;
  }
}
