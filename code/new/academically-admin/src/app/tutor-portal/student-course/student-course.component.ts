import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { StudentCoursesServiceProxy, StudentCourseDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-course',
  templateUrl: './student-course.component.html',
  styleUrls: ['./student-course.component.less'],
  animations: [appModuleAnimation()],
})
export class StudentCourseComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new StudentCourseDto();

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _location: Location,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getStudentCourse();
      }
    });
  }

  ngOnInit(): void {
  }

  onBackClick(): void {
    this._location.back();
  }

  private getStudentCourse(): void {
    this._studentCoursesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
      });
  }
}
