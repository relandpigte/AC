import { AfterViewInit, Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, PassportVerificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';

@Component({
  selector: 'app-passport-verification',
  templateUrl: './passport-verification.component.html',
  styleUrls: ['./passport-verification.component.less']
})
export class PassportVerificationComponent extends AppComponentBase implements AfterViewInit {
  @Output() passportVerified = new EventEmitter();
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;
  passportVerificationExtensions = fileUploadConfiguration.allowedImageExtensions;
  isLoading = false;
  passport: FileParameter;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _passportVerificationsService: PassportVerificationsServiceProxy,
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.passport = files[0];
      } else {
        this.passport = undefined;
      }
    })
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._passportVerificationsService.create(this.passport)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.message.success(this.l('PassportUploadedSuccessMessage'));
        this.passportVerified.emit();
        this._modal.hide();
      });
  }
}
