import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { countries } from '@shared/constants/countries';
import { FileParameter, UserQualificationDto, UserQualificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-qualification',
  templateUrl: './create-edit-qualification.component.html',
  styleUrls: ['./create-edit-qualification.component.less']
})
export class CreateEditQualificationComponent extends AppComponentBase implements OnInit {
  @Input() userQualification: UserQualificationDto = new UserQualificationDto();
  @Output() qualificationSaved = new EventEmitter<boolean>();
  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  qualificationExtensions = fileUploadConfiguration.allowedQualificationExtensions;
  yearSelections: string[] = [];
  countries = countries;
  isLoading = false;
  currentYear: number;

  constructor(
    injector: Injector,
    private _modal: BsModalService,
    private _userQualificationsService: UserQualificationsServiceProxy,
  ) {
    super(injector);
    this.currentYear = this.convertToUserDate(new Date()).getFullYear();
    this.yearSelections.push('Present')
    for (let year = this.currentYear; year >= 1900; year--) {
      const sYear = year.toString();
      this.yearSelections.push(sYear);
    }
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.isLoading = true;
    const documentsToUpload = this.documentUploaderComponent.files.map(file => {
      const fileParameter: FileParameter = {
        fileName: file.name,
        data: file,
      };
      return fileParameter;
    });
    const saveSubscription = this.userQualification.id
      ? this._userQualificationsService.update(
        this.userQualification.id,
        this.userQualification.professionalCertificateOrAward,
        this.userQualification.conferringOrganization,
        this.userQualification.summary,
        this.userQualification.city,
        this.userQualification.country,
        this.userQualification.startYear,
        this.userQualification.endYear,
        this.userQualification.gradeAttained,
        documentsToUpload
      )
      : this._userQualificationsService.create(
        this.userQualification.professionalCertificateOrAward,
        this.userQualification.conferringOrganization,
        this.userQualification.summary,
        this.userQualification.city,
        this.userQualification.country,
        this.userQualification.startYear,
        this.userQualification.endYear,
        this.userQualification.gradeAttained,
        documentsToUpload
      );

    saveSubscription
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.qualificationSaved.emit(true);
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onStartYearChange(): void {
    const startYear = this.getYear(this.userQualification.startYear);
    const endYear = this.getYear(this.userQualification.endYear);
    if (startYear > endYear) {
      const sStartYear = startYear === this.currentYear + 1 ? 'Present' : startYear.toString();
      this.userQualification.endYear = sStartYear;
    }
  }

  onEndYearChange(): void {
    const endYear = this.getYear(this.userQualification.endYear);
    const startYear = this.getYear(this.userQualification.startYear);
    if (endYear < startYear) {
      const sEndYear = endYear === this.currentYear + 1 ? 'Present' : endYear.toString();
      this.userQualification.startYear = sEndYear;
    }
  }

  private getYear(year: string): number {
    return year === 'Present' ? this.currentYear + 1 : +year;
  }
}
