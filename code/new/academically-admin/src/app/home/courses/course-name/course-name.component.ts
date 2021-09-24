import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-course-name',
  templateUrl: './course-name.component.html',
  styleUrls: ['./course-name.component.less']
})

export class CourseNameComponent extends AppComponentBase implements OnInit {
  @Output() courseSaved = new EventEmitter();
  @Output() modalClose = new EventEmitter();
  @Output() backClick = new EventEmitter();

  model: CourseDto = new CourseDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.modalClose.emit();
  }

  onBackClick(): void {
    this.backClick.emit();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._coursesService
      .create(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.courseSaved.emit();
        this.modalClose.emit();
      });
  }
}
