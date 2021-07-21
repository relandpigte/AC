import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AcademicLevelDto, AcademicLevelQualificationDto, UserEducationCourseDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, finalize } from 'rxjs/operators';
import { SuggestQualificationComponent } from '../suggest-qualification/suggest-qualification.component';

@Component({
  selector: 'app-create-edit-course',
  templateUrl: './create-edit-course.component.html',
  styleUrls: ['./create-edit-course.component.less']
})
export class CreateEditCourseComponent extends AppComponentBase implements OnInit {
  @Output() userEducationLevelSaved = new EventEmitter<UserEducationCourseDto>();
  model: UserEducationCourseDto = new UserEducationCourseDto();
  academicLevels: AcademicLevelDto[] = [];
  academicLevelQualifications: AcademicLevelQualificationDto[] = [];
  isCreateMode = true;
  isLevelsLoading = false;
  isQualificationsLoading = false;

  constructor(
    injector: Injector,
    private _userEducationsService: UserEducationsServiceProxy,
    private _modalService: BsModalService,
    private _modal: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (!this.model) {
      this.model = new UserEducationCourseDto();
    } else {
      this.isCreateMode = false;
    }
    this.getAcademicLevels();
  }

  onFormSubmit(): void {
    this.userEducationLevelSaved.emit(this.model);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onAcademicLevelSelect(academicLevelId: string): void {
    const academicLevel = this.academicLevels.find(e => e.id === academicLevelId);
    this.model.academicLevel = academicLevel;
    this.model.academicLevelId = academicLevel.id;
    this.model.academicLevelQualificationId = null;
    this.getQualifications();
  }

  onQualificationSelect(academicLevelQualificationId: string): void {
    const academicLevelQualification = this.academicLevelQualifications.find(e => e.id === academicLevelQualificationId);
    this.model.academicLevelQualification = academicLevelQualification;
    this.model.academicLevelQualificationId = academicLevelQualification.id;
  }

  onSuggestQualificationClick(): void {
    const academicLevel = this.academicLevels.find(e => e.id === this.model.academicLevelId);
    const modalSettings = this.defaultModalSettings as ModalOptions<SuggestQualificationComponent>;
    modalSettings.initialState = {
      academicLevel: academicLevel,
    };
    const modal = this._modalService.show(SuggestQualificationComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(qualification => {
        this.model.academicLevelQualificationId = qualification.id;
        this.model.academicLevelQualification = qualification;
        this.getQualifications();
      });
  }

  private getAcademicLevels(): void {
    this.isLevelsLoading = true;
    this._userEducationsService.getAcademicLevels()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLevelsLoading = false;
        }),
      )
      .subscribe(response => {
        this.academicLevels = response;
        if (!this.model.academicLevelId) {
          const academicLevel = this.academicLevels[0];
          this.model.academicLevel = academicLevel;
          this.model.academicLevelId = academicLevel.id;
        }
        this.getQualifications();
      });
  }

  private getQualifications(): void {
    this.isQualificationsLoading = true;
    this._userEducationsService.getQualifications(this.model.academicLevelId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isQualificationsLoading = false;
        }),
      )
      .subscribe(response => {
        this.academicLevelQualifications = response;
        if (!this.model.academicLevelQualificationId) {
          const academicLevelQualification = this.academicLevelQualifications[0];
          this.model.academicLevelQualification = academicLevelQualification;
          this.model.academicLevelQualificationId = academicLevelQualification.id;
        }
      });
  }
}
