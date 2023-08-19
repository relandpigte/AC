import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ArticleDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-tutor-created',
  templateUrl: './tutor-created.component.html',
  styleUrls: ['./tutor-created.component.less']
})
export class TutorCreatedComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = Array(this.getRndInteger(2, 4)).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  articles: ArticleDto[] = Array(this.getRndInteger(1, 3)).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
  isLoading = true;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
}
