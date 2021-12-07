import { Component, OnInit, Injector } from '@angular/core';
import { CoursesServiceProxy, CourseDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less'],
  animations: [appModuleAnimation()],
})
export class MessagesComponent extends AppComponentBase implements OnInit {
  courseId: string;
  course: CourseDto = new CourseDto();
  userTitle: string;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      this.courseId = paramMap.get('course-id');
      this.getCourse();
    });
  }

  ngOnInit(): void {
  }

  private getCourse(): void {
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(course => {
        this.course = course;
      });
  }
}
