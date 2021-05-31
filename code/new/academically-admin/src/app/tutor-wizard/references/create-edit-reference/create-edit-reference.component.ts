import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, ReferenceDto, ReferenceRelationshipType, ReferencesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { pipe } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-reference',
  templateUrl: './create-edit-reference.component.html',
  styleUrls: ['./create-edit-reference.component.less']
})
export class CreateEditReferenceComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Input() model: ReferenceDto;
  @Output() referenceSaved = new EventEmitter();
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;

  referenceFile: FileParameter;
  defaultFile: DefaultFile;
  phoneNumber: any;
  referenceFileExtensions = fileUploadConfiguration.allowedReferenceExtensions;
  isLoading = false;

  ReferenceRelationshipType = ReferenceRelationshipType;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _referencesService: ReferencesServiceProxy,
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.referenceFile = files[0];
      } else {
        this.referenceFile = undefined;
      }
    });
    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.defaultFile = undefined;
    });
    if (this.model && this.model.document) {
      this.defaultFile = new DefaultFile();
      this.defaultFile.name = this.model.document.originalFileName;
      this.defaultFile.url = this.model.referenceFileUrl;
      this.defaultFile.size = this.model.document.size;
      this.documentUploader.defaultFile = this.defaultFile;
    }
  }

  ngOnInit(): void {
    if (!this.model) {
      this.model = new ReferenceDto();
    } else {
      if (this.model.phone) {
        this.phoneNumber = this.formatPhoneNumber(this.model.phone);
      }
    }
  }

  onFormSubmit(): void {
    const phoneNumber = this.phoneNumber ? this.phoneNumber.internationalNumber : undefined;
    this.isLoading = true;
    (!this.model.id ? this._referencesService.create(
      this.model.forename,
      this.model.surname,
      this.model.email,
      phoneNumber,
      this.model.relationship,
      this.referenceFile,
    ) : this._referencesService.update(
      this.model.forename,
      this.model.surname,
      this.model.email,
      phoneNumber,
      this.model.relationship,
      this.referenceFile,
      this.model.id,
    ))
      .pipe(
        takeUntil(this.destroyed$),
        pipe(finalize(() => {
          this.isLoading = false;
        }))
      )
      .subscribe(() => {
        this.referenceSaved.emit();
        this.notify.success(this.l('SavedSuccessfully'));
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
