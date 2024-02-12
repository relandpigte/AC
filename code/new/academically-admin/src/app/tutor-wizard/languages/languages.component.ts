import { Component, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SpokenLanguagesComponent } from '@app/profile/spoken-languages/spoken-languages.component';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy, TutorVerificationStepStatus } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-tutor-wizard-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.less']
})
export class LanguagesComponent extends AppComponentBase {
  @ViewChild(SpokenLanguagesComponent) spokenLanguages: SpokenLanguagesComponent;
  isLoading = false;
  userId: number;
  isReadOnly = false;
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;
  tutorVerificationStepStatus = TutorVerificationStepStatus;
  tutorVerificationPrevStep: TutorVerificationStepDto;
  tutorVerificationNextStep: TutorVerificationStepDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _appSession: AppSessionService
  ) {
    super(injector);
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this._appSession.userId;
      this.isReadOnly = (this.userId !== this._appSession.userId);
    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
      this.tutorVerificationStep = step;

      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.Languages) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.Languages).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
      if (this.isReadOnly) {
        this._tutorApplicationService.getPreviousStep(step.tutorVerificationId, BecomeATutorStep.Languages).subscribe(result => {
          this.tutorVerificationPrevStep = result;
        });

        this._tutorApplicationService.getNextStep(step.tutorVerificationId, BecomeATutorStep.Languages).subscribe(result => {
          this.tutorVerificationNextStep = result;
        });
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onNextClick(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.Languages)
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

  onNavigateNextScreen(): void {
    if (this.tutorVerificationNextStep?.status === TutorVerificationStepStatus.Saved) {
      this._router.navigate([`app/tutor-applications/${this.userId}/services-offered`]);
    }
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
      this._router.navigate([`app/tutor-applications/${this.userId}/research`]);
    } else {
      this._router.navigate([`app/tutor-wizard/research`]);
    }
  }

  private updateNextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.ServicesOffered;
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
