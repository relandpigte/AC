import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BecomeATutorStep, DbsCertificateDto, DbsCertificatesServiceProxy, FileParameter, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-dbs-check',
  templateUrl: './dbs-check.component.html',
  styleUrls: ['./dbs-check.component.less']
})
export class DbsCheckComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;

  model: DbsCertificateDto = new DbsCertificateDto();
  dbsCertificatesFileExtensions = fileUploadConfiguration.allowedDbsCertificateExtensions;
  dbsCertificateFile: FileParameter;
  defaultFile: DefaultFile;
  dateOfIssue: Date;
  datePickerConfig: BsDatepickerConfig;
  isLoading = false;
  isDbsRequired = false;
  isDbsCheckAgreed = false;

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _dbsCertificatesService: DbsCertificatesServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.getDbsCertificate();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    if (!this.isDbsRequired && this.model.id) {
      if (this.model.id) {
        this._dbsCertificatesService.delete(this.model.id)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.updateStep();
          });
      } else {
        this.updateStep();
      }
    } else if (this.isDbsRequired) {
      if (this.dateOfIssue) {
        this.model.dateOfIssue = moment.utc(moment(this.dateOfIssue).format('YYYY-MM-DD'));
      }
      (this.model.id ? this._dbsCertificatesService.update(
        this.model.dbsNumber,
        this.model.dateOfIssue,
        this.dbsCertificateFile,
        this.model.id,
      ) : this._dbsCertificatesService.create(
        this.model.dbsNumber,
        this.model.dateOfIssue,
        this.dbsCertificateFile
      ))
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(() => {
          this.updateStep();
        });
    } else {
      this.updateStep();
    }
  }

  onDbsRequiredChange(): void {
    if (this.isDbsRequired) {
      this.initializeDocumentUploader();
    }
  }

  onSkipClick(): void {
    this.updateStep();
  }

  private updateStep(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.DbsCheck)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateNextStep();
      });
  }

  private updateNextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.TermsOfUse;
    this._tutorWizardService.updateStep(nextStep)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((result) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._becomeATutorService.currentStep = nextStep;
        this._becomeATutorService.currentTutorWizardStep = result;
      });
  }

  private getDbsCertificate(): void {
    this.isLoading = true;
    this._dbsCertificatesService.getAll(undefined, undefined, undefined)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(result => {
        if (result && result.items && result.items.length) {
          this.model = result.items[0];
          this.isDbsRequired = true;
          this.isDbsCheckAgreed = true;
          this.initializeDocumentUploader();
          if (this.model.dateOfIssue) {
            this.dateOfIssue = this.model.dateOfIssue.toDate();
          }
        }
      });
  }

  private initializeDocumentUploader(): void {
    setTimeout(() => {
      this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
        if (files && files.length) {
          this.dbsCertificateFile = files[0];
        } else {
          this.dbsCertificateFile = undefined;
        }
      });
      this.documentUploader.defaultFileRemoved.subscribe(() => {
        this.defaultFile = undefined;
      });
      if (this.model && this.model.id) {
        this.defaultFile = new DefaultFile();
        this.defaultFile.name = this.model.document.originalFileName;
        this.defaultFile.url = this.model.dbsCertificateFileUrl;
        this.defaultFile.size = this.model.document.size;
        this.documentUploader.defaultFile = this.defaultFile;
      }
    });
  }
}
