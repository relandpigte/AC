import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { StudentCoursesServiceProxy, StudentCourseDto, UserDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less'],
  animations: [appModuleAnimation()],
})
export class MessagesComponent extends AppComponentBase implements OnInit {
  id: string;

  model = new StudentCourseDto();

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
