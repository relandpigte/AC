import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, CourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-student-learning',
  templateUrl: './student-learning.component.html',
  styleUrls: ['./student-learning.component.less']
})
export class StudentLearningComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = Array(this.getRndInteger(2, 4)).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  articles: ArticleDto[] = Array(this.getRndInteger(1, 3)).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
  isLoading = true;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {}

}
