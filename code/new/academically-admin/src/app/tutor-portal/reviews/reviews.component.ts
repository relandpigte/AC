import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@app/courses/_services/course.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less'],
  animations: [appModuleAnimation()],
})
export class ReviewsComponent extends AppComponentBase implements OnInit {
  id: string;
  course: CourseDto = new CourseDto();

  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _couseService: CourseService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);

    _couseService.course$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(course => {
        this.course = course;
      });
  }

  ngOnInit(): void {
  }
}
