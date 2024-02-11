import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { UpdateCourseSettingsDto, CourseDto, CoursesServiceProxy, CourseType, CommentSetting, ServicesType, ServiceFeatureFlagDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { CourseService } from '@app/courses/_services/course.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as _ from 'lodash';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { switchMap } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AutoSaveComponentBase implements OnInit {
  @Output() backClicked = new EventEmitter();
  @Output() settingsSaved = new EventEmitter();

  id: string;
  model = new CourseDto();
  flags = new ServiceFeatureFlagDto();
  isLoading = false;

  CourseType = CourseType;
  datePickerConfig: BsDatepickerConfig;

  cohortStartDate: Date;
  cohortEndDate: Date;
  CommentSetting = CommentSetting;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  get IsCohort(): boolean { return this.model.type === CourseType.Cohort; }
  get IsCommentsVisible(): boolean { return this.model.commentsVisibility === CommentSetting.Visible; }

  ngOnInit(): void {
    this._courseService.course$
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this.cohortStartDate = course.startDate ? this.convertMomentToDate(course.startDate) : new Date();
        this.cohortEndDate = course.endDate ? this.convertMomentToDate(course.endDate) : new Date();
        if (course && course.id && !this.id && this.id !== course.id) {
          this.id = course.id;
          this.getCourse();

          this.flags.init({
            referenceId: course.id,
            serviceType: ServicesType.Course,
            creatorUserId: this.currentUserId
          });
          this.getServiceFlags();
        }
      });
  }

  toggleVisibility(): void {
    this.model.isVisible = !this.model.isVisible;
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

  private getCourse(): void {
    this._coursesService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model.init(response);

        setTimeout(() => {
          this.modelToSave = [this.model, this.flags];
          this.initAutoSave(this.saveSettings);
        });
      });
  }

  private getServiceFlags(): void {
    this.pipeDestroy(this._servicesService.getFeatureFlags(this.id), response => {
      if (_.isEmpty(response)) {
        return;
      }
      this.flags.init(response);
    });
  }

  private saveSettings(): void {
    this._coursesService.updateSettings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .pipe(switchMap(() => this._servicesService.saveFeatureFlags(this.flags)))
      .subscribe(flags => this.flags.init(flags));
  }
}
