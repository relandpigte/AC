import { Component, OnInit, Injector } from '@angular/core';
import { UpdateCourseDetailsDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseService } from '@app/courses/_services/course.service';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AppComponentBase implements OnInit {
  course = new UpdateCourseDetailsDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._courseService.course$
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this.course.id = course.id;
        this.course.name = course.name;
        this.course.subtitle = course.subtitle;
        this.course.description = course.description;
      });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._coursesService.updateDetails(this.course)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this._courseService.course = course;
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }
}
