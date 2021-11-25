import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CoursesServiceProxy, CourseDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  animations: [appModuleAnimation()],
})
export class LayoutComponent extends AppComponentBase implements OnInit {
  courseId: string;
  model: CourseDto = new CourseDto();

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
  }

  ngOnInit(): void {
    this.getCoure();
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  private getCoure(): void {
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
      });
  }

}
