import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ArticleDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-student-learning',
  templateUrl: './student-learning.component.html',
  styleUrls: ['./student-learning.component.less']
})
export class StudentLearningComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = Array(this.getRndInteger(2, 4)).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  articles: ArticleDto[] = Array(this.getRndInteger(1, 3)).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
  isLoading = true;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {}

}
