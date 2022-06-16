import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UpdateCourseSettingsDto, CourseDto, CoursesServiceProxy, CourseType, CommentSetting } from '@shared/service-proxies/service-proxies';
import { CourseService } from '@app/courses/_services/course.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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

  CourseType = CourseType;
  datePickerConfig: BsDatepickerConfig;

  cohortStartDate: Date;
  cohortEndDate: Date;

  CommentSetting = CommentSetting;

  get IsCohort(): boolean { return this.model.type === CourseType.Cohort; }
  get IsCommentsVisible(): boolean { return this.model.commentsVisibility === CommentSetting.Visible; }

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
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
        this.cohortStartDate = course.startDate ? this.convertMomentToDate(course.startDate) : new Date();
        this.cohortEndDate = course.endDate ? this.convertMomentToDate(course.endDate) : new Date()
      });
  }

  onCohortStartDateTimeChange(): void {
    if (this.cohortStartDate) {
      this.model.startDate = this.convertDateToMoment(this.cohortStartDate);
    }
  }

  onCohortEndDateTimeChange(): void {
    if (this.cohortEndDate) {
      this.model.endDate = this.convertDateToMoment(this.cohortEndDate);
    }
  }

  onBackClick(): void {
    this.backClicked.emit();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    const input = new UpdateCourseSettingsDto();
    Object.assign(input, this.model);

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
