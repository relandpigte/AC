import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
  animations: [appModuleAnimation()],
})
export class OverviewComponent extends AppComponentBase {
  id: string;
  model: CourseDto = new CourseDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.id = paramMap.get('course-id');
        this.getCourse();
      }
    });
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
      });
  }
}
