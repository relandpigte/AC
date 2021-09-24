import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UpdateCourseSettingsDto, CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { CourseService } from '@app/courses/_services/course.service';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AppComponentBase implements OnInit {
  @Output() backClicked = new EventEmitter();
  @Output() settingsSaved = new EventEmitter();
  model = new CourseDto();
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
        this.model = course;
      });
  }

  onBackClick(): void {
    this.backClicked.emit();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    const input = new UpdateCourseSettingsDto();
    input.id = this.model.id;
    input.isVisible = this.model.isVisible;
    input.isOpen = this.model.isOpen;
    this._coursesService.updateSettings(input)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this._courseService.course = course;
        this.notify.success(this.l('SavedSuccessfully'));
        this.settingsSaved.emit();
      });
  }
}
