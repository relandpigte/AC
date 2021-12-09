import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CoursesServiceProxy, CourseDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@app/courses/_services/course.service';

@Component({
  selector: 'app-tutor-portal',
  templateUrl: './tutor-portal.component.html',
  styleUrls: ['./tutor-portal.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorPortalComponent extends AppComponentBase implements OnInit {
  id: string;
  model: CourseDto = new CourseDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.id = paramMap.get('course-id');
        // this.getCourse();
      }
    });
  }

  ngOnInit(): void {
    this.getCourse();
  }



  private getCourse(): void {
    this.isLoading = true;
    this._coursesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.model = response;
        this._courseService.course = response;
      });
  }
}
