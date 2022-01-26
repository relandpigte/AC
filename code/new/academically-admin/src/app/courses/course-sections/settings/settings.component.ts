import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UpdateCourseSectionSettingsDto, CommentSetting, CourseSectionType, CourseSectionsServiceProxy, CourseSectionDripType } from '@shared/service-proxies/service-proxies';
import { CourseSectionService } from '../_services/course-section.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

enum EditField {
  DripDelay = 1,
  Comments = 2,
  Visibility,
  StorePreview,
  Prerequisite,
  Assignments,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AppComponentBase implements OnInit {
  model: UpdateCourseSectionSettingsDto = new UpdateCourseSectionSettingsDto();
  CommentSetting = CommentSetting;
  isLoading = false;
  editField: EditField;
  courseSectionType: CourseSectionType;
  EditField = EditField;
  CourseSectionType = CourseSectionType;

  daysFromEnrollmentDate: string;
  daysFromCourseStartDate: string;
  sectionAvailableOn: Date;
  datePickerConfig: BsDatepickerConfig;
  DripType = CourseSectionDripType;

  constructor(
    injector: Injector,
    private _courseSectionsService: CourseSectionsServiceProxy,
    private _courseSectionService: CourseSectionService,
    private _cd: ChangeDetectorRef,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.datePickerConfig.minDate = new Date();
    this._courseSectionService.courseSectionCreated$.subscribe(courseSection => {
      if (courseSection) {
        this.model.init(courseSection);
        this.courseSectionType = courseSection.type;

        switch (this.model.dripType) {
          case this.DripType.DaysFromCourseStartDate:
            this.daysFromCourseStartDate = this.model.dripValue;
            break;
          case this.DripType.SpecificDate:
            if (this.model.dripValue && this.model.dripValue.trim()) {
              console.log(this.model.dripValue);
              const dateParts = this.model.dripValue.split('/');
              const day = +dateParts[0];
              const month = +dateParts[1] - 1;
              const year = +dateParts[2];
              this.sectionAvailableOn = new Date(year, month, day);
            }
            break;
          default:
            this.daysFromEnrollmentDate = this.model.dripValue;
            break;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.isLoading = true;

    switch (this.model.dripType) {
      case this.DripType.DaysFromCourseStartDate:
        this.model.dripValue = this.daysFromCourseStartDate;
        break;
      case this.DripType.SpecificDate:
        if (this.sectionAvailableOn) {
          const dateParts = [
            this.sectionAvailableOn.getDate(),
            this.sectionAvailableOn.getMonth() + 1,
            this.sectionAvailableOn.getFullYear(),
          ];
          this.model.dripValue = dateParts.join('/');
        }
        break;
      default:
        this.model.dripValue = this.daysFromEnrollmentDate;
        break;
    }

    this._courseSectionsService.updateSettings(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
        });
      });
  }

  onEditClick(editField: EditField): void {
    this.editField = editField;
  }

  onDripTypeChange(): void {
    this.daysFromEnrollmentDate = undefined;
    this.daysFromCourseStartDate = undefined;
    this.sectionAvailableOn = undefined;
  }

  onCommentSettingChange(): void {
    if (this.model.commentSetting !== CommentSetting.Visible) {
      this.model.isCommentModerationEnabled = false;
    }
  }
}

