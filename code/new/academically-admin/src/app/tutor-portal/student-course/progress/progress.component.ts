import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { StudentCoursesServiceProxy, StudentCourseDto, UserDto, StudentCourseSectionStatus } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less'],
  animations: [appModuleAnimation()],
})
export class ProgressComponent extends AppComponentBase implements OnInit {
  id: string;

  model = new StudentCourseDto();
  StudentCourseSectionStatus = StudentCourseSectionStatus;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this.model.creatorUser = new UserDto();
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getStudentCourse();
      }
    });
  }

  ngOnInit(): void {
  }

  getLessonImageUrl(lessonImageUrl: string): string {
    if (lessonImageUrl) {
      return lessonImageUrl;
    }
    return '/assets/themes/dashkit/img/avatars/projects/project-1.jpg';
  }

  private getStudentCourse(): void {
    this._studentCoursesService.getWithSections(this.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
      });
  }
}
