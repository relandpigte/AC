import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BecomeATutorStep, DbsCertificateDto, DbsCertificatesServiceProxy, FileParameter, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy, TutorVerificationStepStatus } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
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
  userId: number;
  isReadOnly = false;
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;
  tutorVerificationStepStatus = TutorVerificationStepStatus;
  
  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _dbsCertificatesService: DbsCertificatesServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';

    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this.appSession.userId;
      this.isReadOnly = (this.userId !== this.appSession.userId);
    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
      this.tutorVerificationStep = step;
      if (this.isReadOnly) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.DbsCheck).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
    });
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

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/terms-of-use`]);
  }

  onStatusChange(event: any): void {
    const isApproved = event.target.value === 'approved';
    if (isApproved) {
      this.isApproving = true;
      this._tutorWizardService.approve(this.tutorVerificationStep.id)
        .subscribe(() => {
          this.getPendingStep();
        });
    } else {
      event.preventDefault();
      this.showDeclinedModal(this.tutorVerificationStep);
    }
  }

  onBackClick(): void {
    if (this.isReadOnly) {
      this._router.navigate([`app/tutor-applications/${this.userId}/references`]);
    } else {
      this._router.navigate([`app/tutor-wizard/references`]);
    }
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
    this._dbsCertificatesService.getAll(this.userId, undefined, undefined, undefined)
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

  private getPendingStep(): void {
    this._tutorWizardService.getPendingStep(this.userId)
    .pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.isApproving = false)
    )
    .subscribe(result => {
      this._becomeATutorService.currentStep = result.step;
      this._becomeATutorService.currentTutorWizardStep = result;
      this.onNavigateNextScreen();
    });
  }

  private showDeclinedModal(model: TutorVerificationStepDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<TutorWizardStepDeclinedComponent>;
    modalSettings.initialState = {
      model: model,
    };
    const modal = this._modalService.show(TutorWizardStepDeclinedComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getPendingStep();
      });
  }
}
