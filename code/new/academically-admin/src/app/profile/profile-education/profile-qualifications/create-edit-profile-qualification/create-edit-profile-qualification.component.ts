import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FileParameter, UserQualificationDto, UserQualificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DocumentUploaderComponent } from '@app/shared/components/document-uploader/document-uploader.component';
import { finalize } from 'rxjs/operators';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-create-edit-profile-qualification',
  templateUrl: './create-edit-profile-qualification.component.html',
  styleUrls: ['./create-edit-profile-qualification.component.less']
})
export class CreateEditProfileQualificationComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() userQualification: UserQualificationDto = new UserQualificationDto();
  @Output() qualificationSaved = new EventEmitter<boolean>();
  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  qualificationExtensions = fileUploadConfiguration.allowedQualificationExtensions;
  yearSelections: string[] = [];
  isLoading = false;
  editor: Editor;

  constructor(
    injector: Injector,
    private _modal: BsModalService,
    private _userQualificationsService: UserQualificationsServiceProxy,
  ) {
    super(injector);
    const currentYear = this.convertToUserDate(new Date()).getFullYear();
    this.yearSelections.push('Present')
    for (let year = currentYear; year >= 1900; year--) {
      const sYear = year.toString();
      this.yearSelections.push(sYear);
    }
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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
        this.userQualification.startYear,
        this.userQualification.gradeAttained,
        documentsToUpload
      )
      : this._userQualificationsService.create(
        this.userQualification.professionalCertificateOrAward,
        this.userQualification.conferringOrganization,
        this.userQualification.summary,
        this.userQualification.startYear,
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
}
