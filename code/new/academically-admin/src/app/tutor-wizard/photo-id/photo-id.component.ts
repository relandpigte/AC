import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BecomeATutorStep, FileParameter, PhotoIdVerificationsServiceProxy, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-photo-id',
  templateUrl: './photo-id.component.html',
  styleUrls: ['./photo-id.component.less']
})
export class PhotoIdComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;
  photIdVerificationExtensions = fileUploadConfiguration.allowedImageExtensions;
  photoId: FileParameter;
  defaultFile: DefaultFile;
  isLoading: boolean;
  userId: number;
  isReadOnly: boolean;
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _photoIdVerificationsService: PhotoIdVerificationsServiceProxy,
    private _becomeATutorService: BecomeATutorService,
    private _appSession: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this._appSession.userId;
      this.isReadOnly = (this.userId !== this._appSession.userId);
      this.getLatestPhotoIdVerification();
    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
      this.tutorVerificationStep = step;

      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.PhotoId) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.PhotoId).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {

      if (files && files.length) {
        this.photoId = files[0];
      } else {
        this.photoId = undefined;
      }
    });
    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.defaultFile = undefined;
    });
  }

  onNextClick(): void {
    this.isLoading = true;
    if (!this.defaultFile) {
      this._photoIdVerificationsService.create(this.photoId)
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(() => {
          this.updateCurrentStep();
        });
    } else {
      this.updateCurrentStep();
    }
  }

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/address`]);
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
      this._router.navigate([`app/tutor-applications/${this.userId}/profile-picture`]);
    } else {
      this._router.navigate([`app/tutor-wizard/profile-picture`]);
    }
  }

  private getLatestPhotoIdVerification(): void {
    this.isLoading = true;
    this._photoIdVerificationsService.getLatest(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(photoIdVerification => {
        if (photoIdVerification && photoIdVerification.document) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = photoIdVerification.document.originalFileName;
          this.defaultFile.url = photoIdVerification.photoIdUrl;
          this.defaultFile.size = photoIdVerification.document.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }
      });
  }

  private updateCurrentStep(): void {
    this._tutorWizardService.updateStep(BecomeATutorStep.PhotoId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateStep();
      });
  }

  private updateStep(): void {
    const nextStep = BecomeATutorStep.Address;
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
