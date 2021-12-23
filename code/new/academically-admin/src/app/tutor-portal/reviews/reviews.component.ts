import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@app/courses/_services/course.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, UserDto, StudentCoursesServiceProxy } from '@shared/service-proxies/service-proxies';
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
  users: UserDto[] = [];

  isLoading = false;

  constructor(
    injector: Injector,
    couseService: CourseService,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);

    couseService.course$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(course => {
        this.course = course;
        this.getRecentGraduates();
      });
  }

  ngOnInit(): void {
  }

  private getRecentGraduates(): void {
    this._studentCoursesService.getRecentGraduates(this.course.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(users => {
        this.users = users;
      });
  }
}
