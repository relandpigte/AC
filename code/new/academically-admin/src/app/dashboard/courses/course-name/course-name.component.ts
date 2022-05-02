import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router } from '@angular/router';

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
  isValid: boolean;
  constructor(
    injector: Injector,
    private _router: Router,
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
      .subscribe((response) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.modalClose.emit();
        this._router.navigate(['/app/courses', response.id]);
      });
  }

  getCourseName(event) {
    if (event.target.value.trim().length > 0) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
}
